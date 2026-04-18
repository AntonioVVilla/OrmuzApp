# Changelog

All notable changes to OrmuzApp are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **i18n**: `react-i18next` con locales `es` (default) y `en`;
  detección vía `react-native-localize`. Toda la UI visible
  pasa por `t('...')`.
- **a11y**: etiquetas, roles (`button`, `adjustable`,
  `tablist`, `alert`) y estados seleccionados en chips de
  combustible, slider de radio, markers, bottom sheet. Touch
  targets ≥ 44 pt.
- **Paleta colorblind-safe** opcional (viridis) además del
  verde→rojo por defecto, con indicador redundante €/€€/€€€
  en markers y detalle de estación.
- **Zod**: validación runtime de la respuesta de la API y del
  caché (`src/schemas/api.ts`, `src/schemas/station.ts`).
- **Retry con backoff exponencial** en la API del ministerio
  (3 intentos, 500 ms → 2 s → 5 s, jitter).
- **Error boundary global** con CTA "Reintentar" y mensaje
  traducible.
- **EmptyState** (mapa sin estaciones, con CTAs "Aumentar
  radio" y "Reintentar") y **OfflineBadge** (pill persistente
  cuando se muestran datos de caché sin red).
- **LoadingOverlay** con modo `subtle` no bloqueante cuando ya
  hay datos visibles.
- **`useDeferredValue`** en el slider de radio para mover el
  filtrado fuera del hilo de interacción.
- **Tests unitarios** (57 en verde) para utils, services,
  schemas y hooks. Coverage ≥ 60 % líneas, branches y
  statements.
- **CODEOWNERS**, **Dependabot** (npm / gradle / actions /
  docker), **CodeQL** (security-and-quality) y **gitleaks**
  (secret scanning histórico).
- **ATTRIBUTION.md**, **SECURITY.md**, **CONTRIBUTING.md**,
  plantillas de issue y PR.
- **SBOM** SPDX 2.3 generado en cada release.

### Changed

- **TypeScript strict mode** (`strict: true`,
  `noUncheckedIndexedAccess`, `noImplicitOverride`). Nuevo
  script `npm run typecheck`.
- **Errores tipados** (`AppError` con códigos `NETWORK`,
  `PARSE`, `PERMISSION`, `OFFLINE_STALE`, `UNKNOWN`) en vez
  de `string | null`.
- **React.memo** en componentes hoja (StationMarker,
  MarkerCallout, PriceRow, chips de FuelTypeSelector).
- **Docker**: Dockerfile multi-stage (builder → output
  alpine), usuario no-root, cache mounts de BuildKit,
  secretos de firma por ARG.
- **CI**: `build-apk.yml` sustituido por `ci.yml`
  (lint/typecheck/test/APK debug) + `release.yml` (firma,
  mapping, SBOM, release). CodeQL y secret-scanning como
  workflows independientes.
- **Android release**: firma real (env vars o
  gradle.properties), ProGuard/R8 on, `shrinkResources true`,
  splits por ABI (armeabi-v7a, arm64-v8a, x86_64),
  `networkSecurityConfig` HTTPS-only.
- **AndroidManifest**: `ACCESS_COARSE_LOCATION` eliminado (la
  app requiere FINE para precisión de provincia).

### Fixed

- **iOS**: `requestPermission()` ya no devolvía `false` en
  iOS; ahora usa `Geolocation.requestAuthorization('whenInUse')`.
- **iOS**: `NSLocationWhenInUseUsageDescription` con copy real
  (en blanco era causa de rechazo en App Store).
- **Provincia cambiada**: al mover GPS a otra provincia, las
  estaciones de la anterior ya no se mostraban detrás del
  spinner (reset explícito en `useStations`).
- **Caché corrupto**: JSON inválido en AsyncStorage → se
  ignora y refetch, ya no crashea.

## [1.0.0] — 2026-04-07

### Added

- Primera versión pública. Mapa MapLibre con estaciones por
  provincia, color-coding verde→rojo por precio, detalle en
  bottom sheet y filtro por tipo de combustible y radio.

[Unreleased]: https://github.com/AntonioVVilla/OrmuzApp/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/AntonioVVilla/OrmuzApp/releases/tag/v1.0.0
