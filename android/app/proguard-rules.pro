# Project-specific ProGuard / R8 rules.
# Applied on top of the default Android rules and react-native's own
# consumer rules from node_modules/react-native/ReactAndroid.

# --- MapLibre ---
# MapLibre uses reflection to look up native style/layer classes at
# runtime; unconditionally keep everything in its package.
-keep class org.maplibre.** { *; }
-keep interface org.maplibre.** { *; }
-dontwarn org.maplibre.**

# --- React Native core (safety net for reflection-heavy internals) ---
# RN registers modules/views via annotations and looks them up by name.
# R8 can mis-rename those classes unless we pin the package.
-keep class com.facebook.react.** { *; }
-keep interface com.facebook.react.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.yoga.** { *; }
-dontwarn com.facebook.react.**
-dontwarn com.facebook.jni.**
-dontwarn com.facebook.hermes.**

# Keep annotations the RN bridge reads at runtime.
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod
-keep @com.facebook.react.bridge.ReactMethod class * { *; }
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod <methods>;
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
    @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>;
}

# --- React Native Geolocation Service ---
-keep class com.agontuk.RNFusedLocation.** { *; }
-dontwarn com.agontuk.RNFusedLocation.**

# --- React Native Gesture Handler ---
-keep class com.swmansion.gesturehandler.** { *; }
-dontwarn com.swmansion.gesturehandler.**

# --- Reanimated + Worklets (separate package in RN 0.85) ---
-keep class com.swmansion.reanimated.** { *; }
-keep class com.swmansion.worklets.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }
-dontwarn com.swmansion.reanimated.**
-dontwarn com.swmansion.worklets.**

# --- AsyncStorage (package `org.asyncstorage` since v3) ---
-keep class org.asyncstorage.** { *; }
-dontwarn org.asyncstorage.**

# --- SafeAreaContext ---
-keep class com.th3rdwave.safeareacontext.** { *; }
-dontwarn com.th3rdwave.safeareacontext.**

# --- Localize + Permissions (both under com.zoontek) ---
-keep class com.zoontek.rnlocalize.** { *; }
-keep class com.zoontek.rnpermissions.** { *; }
-dontwarn com.zoontek.**

# --- OkHttp / Retrofit transitive noise (via RN fetch) ---
-dontwarn javax.annotation.**
-dontwarn org.codehaus.mojo.animal_sniffer.IgnoreJRERequirement
-dontwarn okio.**

# --- AndroidX / Kotlin noise we don't care about for a shipped APK ---
-dontwarn kotlinx.coroutines.flow.**

# Preserve line numbers in stack traces to make production crash
# reports actionable while still obfuscating class/method names.
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
