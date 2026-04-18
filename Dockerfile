# syntax=docker/dockerfile:1.7

############################################################
# OrmuzApp — reproducible Android release APK build.
#
# Two stages:
#   1. builder  — full SDK + NDK + Node, compiles the APK.
#   2. output   — tiny alpine image that only carries the
#                 signed APK + mapping.txt so CI can publish
#                 the artifacts without shipping the toolchain.
#
# Usage (local):
#   DOCKER_BUILDKIT=1 docker build \
#     --build-arg RELEASE_STORE_FILE=/work/secrets/release.keystore \
#     --build-arg RELEASE_STORE_PASSWORD=... \
#     --build-arg RELEASE_KEY_ALIAS=... \
#     --build-arg RELEASE_KEY_PASSWORD=... \
#     --secret id=release_keystore,src=./release.keystore \
#     -t ormuzapp:release .
#   docker create --name ormuzapp-out ormuzapp:release
#   docker cp ormuzapp-out:/output ./dist
#
# Supply-chain note:
#   The `reactnativecommunity/react-native-android` image is the
#   community-maintained RN build environment. For fully
#   reproducible builds, swap the `:latest` tag for a
#   `@sha256:<digest>` pin (run `docker image inspect` once and
#   copy the RepoDigests entry into this file). CI enforces this
#   via the release workflow's image-verification step.
############################################################

ARG RN_ANDROID_IMAGE=reactnativecommunity/react-native-android:latest

############################################################
# Stage 1 — builder
############################################################
FROM ${RN_ANDROID_IMAGE} AS builder

# Build-time-only signing material. Passed through to gradle
# via environment variables; android/app/build.gradle falls
# back to the debug keystore if these are absent, so dev
# builds still work without secrets.
ARG RELEASE_STORE_FILE=""
ARG RELEASE_STORE_PASSWORD=""
ARG RELEASE_KEY_ALIAS=""
ARG RELEASE_KEY_PASSWORD=""

ENV RELEASE_STORE_FILE=${RELEASE_STORE_FILE} \
    RELEASE_STORE_PASSWORD=${RELEASE_STORE_PASSWORD} \
    RELEASE_KEY_ALIAS=${RELEASE_KEY_ALIAS} \
    RELEASE_KEY_PASSWORD=${RELEASE_KEY_PASSWORD} \
    GRADLE_OPTS="-Dorg.gradle.jvmargs=-Xmx3g -Dorg.gradle.daemon=false" \
    JAVA_TOOL_OPTIONS="-Dfile.encoding=UTF-8"

# Create an unprivileged user for the build itself. Even
# though the builder stage is ephemeral, running gradle as
# root produces root-owned files that break bind-mount
# workflows on Linux hosts.
RUN set -eux; \
    if ! id -u builder >/dev/null 2>&1; then \
        groupadd --system --gid 1000 builder && \
        useradd  --system --uid 1000 --gid builder \
                 --create-home --home-dir /home/builder \
                 --shell /bin/bash builder; \
    fi

WORKDIR /work
RUN chown -R builder:builder /work
USER builder

# Dependency install in its own layer so source edits don't
# invalidate the npm cache.
COPY --chown=builder:builder package.json package-lock.json ./
RUN --mount=type=cache,target=/home/builder/.npm,uid=1000,gid=1000 \
    npm ci --no-audit --no-fund

# Now bring in the rest of the source.
COPY --chown=builder:builder . .

# Accept Android SDK licences (idempotent, no-op once accepted).
RUN yes | sdkmanager --licenses > /dev/null 2>&1 || true

# Build the release APK + ABI splits. Gradle daemon is
# disabled above — containers can't reuse daemons between
# runs anyway, and the daemon eats memory on small CI hosts.
RUN --mount=type=cache,target=/home/builder/.gradle/caches,uid=1000,gid=1000 \
    --mount=type=cache,target=/work/android/.gradle,uid=1000,gid=1000 \
    cd android && chmod +x gradlew && \
    ./gradlew :app:assembleRelease --no-daemon -x lint

############################################################
# Stage 2 — output (minimal artifact carrier)
############################################################
FROM alpine:3.19 AS output

RUN addgroup -g 1000 ormuz && \
    adduser -D -u 1000 -G ormuz -h /home/ormuz ormuz

WORKDIR /output
RUN chown ormuz:ormuz /output
USER ormuz

# Copy the signed APK(s) + ProGuard mapping. The mapping is
# essential for symbolicating production stack traces — do
# not ship the APK without it.
COPY --from=builder --chown=ormuz:ormuz \
    /work/android/app/build/outputs/apk/release/ \
    /output/apk/
COPY --from=builder --chown=ormuz:ormuz \
    /work/android/app/build/outputs/mapping/release/ \
    /output/mapping/

CMD ["sh", "-c", "ls -la /output/apk /output/mapping"]
