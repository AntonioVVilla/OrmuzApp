# OrmuzApp — Mapa de precios de gasolina en España

[![CI](https://github.com/AntonioVVilla/OrmuzApp/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/AntonioVVilla/OrmuzApp/actions/workflows/ci.yml)
[![CodeQL](https://github.com/AntonioVVilla/OrmuzApp/actions/workflows/codeql.yml/badge.svg?branch=master)](https://github.com/AntonioVVilla/OrmuzApp/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D22.11-brightgreen)](https://nodejs.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.84-61dafb?logo=react)](https://reactnative.dev/)

> **Vibecoded** con [Claude Code](https://claude.ai/code) — generado, auditado y depurado mediante IA.

App Android que muestra en un mapa interactivo los precios de gasolina en España, con marcadores color-coded (verde = barato, rojo = caro). Carga únicamente las gasolineras de la provincia donde estás, sin descargar los ~12.000 registros nacionales.

**Stack**: React Native 0.84.1 · TypeScript · MapLibre v11 (OpenStreetMap) · API del Ministerio de Industria de España

---

## Capturas

> Mapa con marcadores de precio por gasolinera y detalle al pulsar.

---

## Cómo funciona

1. La app obtiene tu ubicación GPS.
2. Detecta en qué provincia estás usando las 52 provincias del INE.
3. Llama únicamente al endpoint de esa provincia:
   ```
   GET /EstacionesTerrestres/FiltroProvincia/{ID}
   ```
   ~500 estaciones y ~300 KB en vez de 12.000 estaciones y ~4 MB.
4. Los marcadores se colorean proporcionalmente al precio: verde (más barato) → rojo (más caro).
5. Al cruzar a otra provincia, recarga automáticamente las estaciones de la nueva provincia.
6. Los datos se cachean por provincia con un TTL configurable. Si no hay red, muestra el caché aunque haya expirado.

---

## Requisitos previos

| Herramienta | Versión | Notas |
|-------------|---------|-------|
| **Node.js** | >= 22.11.0 | [nodejs.org](https://nodejs.org/) |
| **JDK** | 17+ | Recomendado: [Adoptium Temurin 17](https://adoptium.net/) |
| **Android Studio** | Última versión | SDK, emulador y herramientas de build |
| **Android SDK** | 36 | Android Studio > SDK Manager |
| **Build Tools** | 36.0.0 | SDK Manager > SDK Tools |
| **NDK** | 27.1.12297006 | SDK Manager > SDK Tools |

### Variables de entorno (Windows)

Agrega al sistema:

```
ANDROID_HOME = C:\Users\<tu-usuario>\AppData\Local\Android\Sdk
JAVA_HOME    = C:\Program Files\Eclipse Adoptium\jdk-17.x.x
```

Agrega al `PATH`:

```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

Verifica:

```bash
node --version    # >= 22.11.0
java -version     # >= 17
adb --version     # debe responder
```

---

## Instalación

```bash
git clone https://github.com/AntonioVVilla/OrmuzApp.git
cd OrmuzApp
npm install
```

Diagnóstico del entorno:

```bash
npx react-native doctor
```

---

## Previsualizar la app

### Opción A — Dispositivo físico por USB (recomendado)

La más rápida y fiel. Ideal para probar GPS real y rendimiento real del mapa.

1. En el teléfono: **Ajustes > Acerca del teléfono** — toca 7 veces **Número de compilación** para activar Opciones de desarrollador.
2. En **Opciones de desarrollador**, activa **Depuración USB**.
3. Conecta el teléfono por USB.
4. Verifica:

```bash
adb devices   # debe mostrar tu dispositivo
```

5. Lanza:

```bash
# Terminal 1
npm start

# Terminal 2
npm run android
```

> **Tip**: Si Metro no conecta, ejecuta `adb reverse tcp:8081 tcp:8081`.

---

### Opción B — Emulador Android Studio (AVD)

1. Android Studio > **Tools > Device Manager** > crea un AVD:
   - Hardware: **Pixel 7** (o similar)
   - System Image: **API 34+** con Google APIs
   - RAM: mínimo 2 GB
2. Lanza el emulador.
3. Simula ubicación en Madrid (la API solo cubre España):

```bash
adb emu geo fix -3.7038 40.4168
```

4. Ejecuta:

```bash
npm start
npm run android
```

> **Nota**: El emulador consume ~4-8 GB de RAM. El GPS es simulado.

---

### Opción C — APK debug para instalar manualmente

```bash
cd android && ./gradlew assembleDebug
```

APK generado en:

```
android/app/build/outputs/apk/debug/app-debug.apk
```

Instalar en dispositivo conectado:

```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

### Opción D — Docker (sin instalar SDK localmente)

```bash
docker-compose up --build
```

APK resultante en:

```
./output/app-release-unsigned.apk
```

---

## Comandos útiles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia Metro (bundler JS) |
| `npm run android` | Compila e instala en dispositivo/emulador |
| `npm run lint` | ESLint |
| `npm test` | Jest |
| `cd android && ./gradlew assembleDebug` | APK debug |
| `cd android && ./gradlew assembleRelease` | APK release |
| `cd android && ./gradlew clean` | Limpia caches de build |
| `adb devices` | Lista dispositivos conectados |
| `adb logcat *:E` | Logs de error del dispositivo |
| `adb reverse tcp:8081 tcp:8081` | Túnel Metro (USB) |
| `adb emu geo fix <lng> <lat>` | Simula GPS en emulador |
| `npx tsc --noEmit` | Verifica TypeScript sin compilar |
| `npx react-native doctor` | Diagnóstico del entorno |

### Atajos en la app (modo desarrollo)

- **Ctrl+M** en emulador: Dev Menu
- **R R** (doble R): Recarga completa
- Fast Refresh se activa automáticamente al guardar archivos

---

## Estructura del proyecto

```
OrmuzApp/
├── App.tsx                         # Componente raíz
├── index.js                        # Entry point React Native
├── package.json
├── tsconfig.json
├── babel.config.js                 # Plugin de reanimated
├── metro.config.js
├── Dockerfile
├── docker-compose.yml
├── android/
│   ├── build.gradle                # SDK 36, Kotlin 2.1.20, Gradle 8.13
│   ├── gradle.properties           # New Architecture ON, Hermes ON
│   └── app/src/main/
│       └── AndroidManifest.xml     # Permisos: INTERNET, ACCESS_FINE_LOCATION
└── src/
    ├── components/
    │   ├── Map/
    │   │   ├── MapView.tsx          # Mapa MapLibre v11 con cámara y marcadores
    │   │   └── StationMarker.tsx    # Marcador con burbuja de precio color-coded
    │   ├── UI/
    │   │   ├── FuelTypeSelector.tsx # Selector de tipo de combustible
    │   │   ├── SearchRadius.tsx     # Selector de radio de búsqueda
    │   │   ├── LoadingView.tsx      # Spinner de carga
    │   │   └── ErrorView.tsx        # Pantalla de error con reintentar
    │   └── StationDetail/
    │       ├── StationDetailSheet.tsx  # Bottom sheet al pulsar marcador
    │       └── PriceRow.tsx            # Fila de precio por combustible
    ├── hooks/
    │   ├── useLocation.ts           # GPS con permisos Android
    │   ├── useStations.ts           # Carga por provincia + caché + filtro proximidad
    │   └── usePriceColors.ts        # Escala de color verde→rojo por precio
    ├── services/
    │   ├── api.ts                   # fetchStationsByProvince() — endpoint FiltroProvincia
    │   ├── parser.ts                # Normaliza la respuesta cruda de la API
    │   ├── geo.ts                   # Haversine, filtro por radio
    │   └── cache.ts                 # AsyncStorage por provincia con TTL
    ├── utils/
    │   ├── provinces.ts             # 52 provincias con ID y coordenadas de centro
    │   ├── colors.ts                # Interpolación de color y contraste
    │   ├── constants.ts             # URLs, TTL caché, límites
    │   └── formatPrice.ts           # Formato de precio para marcador y detalle
    ├── context/
    │   └── StationContext.tsx       # React Context + useReducer (estado global)
    └── types/
        ├── station.ts               # Tipos Station, Coordinate, FuelPrice
        └── api.ts                   # Tipo RawAPIResponse (respuesta cruda ministerio)
```

---

## Arquitectura de carga de datos

```
GPS location
    │
    ▼
getProvinceId(lat, lng)          ← nearest of 52 provinces by squared distance
    │
    ▼
getCachedStations(provinceId)    ← AsyncStorage, TTL 15 min
    │ miss
    ▼
fetchStationsByProvince(id)      ← GET /EstacionesTerrestres/FiltroProvincia/{id}
    │                               ~500 stations, ~300 KB (vs 12,000 / 4 MB full)
    ▼
parseAllStations()               ← normaliza tipos, coordenadas, precios
    │
    ▼
cacheStations(provinceId, data)  ← guarda en AsyncStorage
    │
    ▼
filterByProximity()              ← Haversine, radio configurable
    │
    ▼
usePriceColors()                 ← asigna color verde→rojo por precio relativo
    │
    ▼
StationMarker[]                  ← renderiza en MapLibre
```

---

## API del Ministerio de Industria

Base URL: `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes`

| Endpoint | Descripción |
|----------|-------------|
| `GET /EstacionesTerrestres/` | Todas las estaciones (~12.000) |
| `GET /EstacionesTerrestres/FiltroProvincia/{id}` | Por provincia (~500) ✅ usado |
| `GET /EstacionesTerrestres/FiltroCCAA/{id}` | Por comunidad autónoma |
| `GET /EstacionesTerrestres/FiltroMunicipio/{id}` | Por municipio |
| `GET /EstacionesTerrestres/FiltroProducto/{id}` | Por tipo de combustible |

Respuesta siempre JSON con `ResultadoConsulta: "OK"` y `ListaEESSPrecio: [...]`.

Los IDs de provincia siguen el estándar INE (01 Álava → 52 Melilla).

---

## Troubleshooting (Windows)

### `JAVA_HOME` no definido al ejecutar Gradle

```
ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
```

**Causa**: Gradle necesita un JDK pero no hay ninguno en el PATH del sistema. Si no tienes JDK instalado por separado, Android Studio incluye el suyo propio.

**Solución temporal** (en la misma sesión de PowerShell):

```powershell
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
./gradlew assembleRelease
```

**Solución permanente** (guarda la variable para siempre):

```powershell
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Android\Android Studio\jbr", "User")
$currentPath = [System.Environment]::GetEnvironmentVariable("PATH", "User")
[System.Environment]::SetEnvironmentVariable("PATH", "C:\Program Files\Android\Android Studio\jbr\bin;$currentPath", "User")
```

Cierra y vuelve a abrir PowerShell para que surta efecto.

---

### APK debug abre con error "adb reverse tcp:8081 / running Metro"

```
Unable to load script. Make sure you're either running a Metro server
or that your bundle is packaged correctly for release.
```

**Causa**: El APK debug está diseñado para desarrollo — carga el bundle JS desde el servidor Metro de tu PC (`localhost:8081`). Sin Metro corriendo o sin el túnel USB, falla.

**Solución A — APK autónomo** (recomendado para instalar en otros dispositivos):

```bash
cd android && ./gradlew assembleRelease
# APK en: android/app/build/outputs/apk/release/app-release-unsigned.apk
```

El APK release lleva el bundle JS embebido y no necesita Metro.

**Solución B — Mantener debug con Metro** (solo para desarrollo con cable USB):

```bash
# Terminal 1: Metro
npm start

# Terminal 2: túnel
adb reverse tcp:8081 tcp:8081
```

---

### `ANDROID_HOME` no definido

```
error Android SDK root is not set. Set it via ANDROID_HOME environment variable.
```

**Solución**: Variable de entorno `ANDROID_HOME` → `C:\Users\<usuario>\AppData\Local\Android\Sdk`.

---

### Licencias de SDK no aceptadas

```
Failed to install the following Android SDK packages
```

**Solución**:

```bash
sdkmanager --licenses   # acepta todo con 'y'
```

---

### Metro no conecta con el dispositivo

```
Could not connect to development server.
```

**Solución**:

```bash
adb reverse tcp:8081 tcp:8081
```

Si usas WiFi, PC y teléfono deben estar en la misma red. Configura la IP del PC en Dev Menu > Settings > Debug server host & port.

---

### Gradle falla por memoria

```
GC overhead limit exceeded
```

**Solución**: Ya configurado en `gradle.properties` con `-Xmx4096m`. Si persiste, cierra otras apps.

---

### Gradle 9.x incompatible con React Native 0.84

```
Could not find method IBM_SEMERU() for arguments...
```

**Causa**: React Native 0.84.1 no es compatible con Gradle 9. Este proyecto ya está fijado en Gradle 8.13 en `gradle/wrapper/gradle-wrapper.properties`. Si actualizas Gradle manualmente, vuelve a:

```properties
distributionUrl=https\://services.gradle.org/distributions/gradle-8.13-bin.zip
```

---

### `storage-android:1.0.0` not found (async-storage v3)

```
Could not find com.reactnativecommunity.asyncstorage:storage-android:1.0.0
```

**Causa**: `@react-native-async-storage/async-storage` v3 publica su artefacto Android en un repositorio Maven local incluido en el paquete npm, no en Maven Central.

**Solución**: Ya añadido en `android/build.gradle`:

```gradle
allprojects {
  repositories {
    maven {
      url(new File(rootProject.projectDir,
        "../node_modules/@react-native-async-storage/async-storage/android/local_repo"))
    }
  }
}
```

---

### App crashea al arrancar — `UIManagerModule` null

```
java.lang.NullPointerException: UIManagerModule is null
```

**Causa**: MapLibre v10 no es compatible con React Native New Architecture (Fabric). Aunque se desactive `newArchEnabled`, RN 0.84 activa Fabric de todos modos.

**Solución**: Este proyecto ya usa MapLibre v11 (`^11.0.0-beta.21`), que sí soporta New Architecture. Si aparece de nuevo, verifica que `package.json` tenga la versión correcta y ejecuta `npm install`.

---

### App crashea — `ReactNativeHost` deprecado

```
java.lang.NoSuchMethodError: ReactNativeHost
```

**Causa**: MapLibre v10 referenciaba la clase `ReactNativeHost` eliminada en RN 0.84. Misma solución que el punto anterior — MapLibre v11 resuelve esto.

---

### `libreact_featureflagsjni.so` not found

```
java.lang.UnsatisfiedLinkError: couldn't find "libreact_featureflagsjni.so"
```

**Causa**: `MainApplication.kt` llamaba a `SoLoader.init()` directamente en vez de `loadReactNative(this)`, que es quien carga todas las librerías nativas correctamente.

**Solución**: El `MainApplication.kt` correcto para RN 0.84:

```kotlin
override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
}
```

---

### El emulador GPS aparece en California (o coordenadas por defecto)

**Causa**: Los emuladores Android arrancan con una ubicación por defecto en EE.UU.

**Solución**: Simula Madrid antes de abrir la app:

```bash
adb emu geo fix -3.7038 40.4168
```

O desde Android Studio: emulador > `...` (Extended Controls) > Location > introduce las coordenadas manualmente.

---

### El emulador no arranca (HAXM / Hyper-V)

**Solución**: Activa Hyper-V en Windows:

```
Panel de control > Programas > Activar o desactivar características de Windows > Hyper-V
```

---

### `adb devices` no muestra el teléfono

1. Depuración USB activa en el teléfono.
2. Modo USB en **Transferencia de archivos (MTP)**.
3. Acepta el diálogo de autorización en el teléfono.
4. Prueba con otro cable (algunos cables son solo de carga).

---

### La app se queda cargando eternamente

La API del ministerio puede ser lenta (~5-10 s) si hay mucha carga. La carga por provincia reduce el payload de ~4 MB a ~300 KB. Si el problema persiste, comprueba conectividad:

```bash
curl https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroProvincia/28
```

---

### `assembleRelease` falla con "Read timed out" o "Host desconocido" en Maven Central

```
Could not download react-android-0.84.1-release.aar
  > Read timed out
Could not GET 'https://repo.maven.apache.org/...'
  > Host desconocido (repo.maven.apache.org)
```

**Causa**: El APK release necesita descargar los `.aar` de React Native (~150 MB) desde Maven Central. Los `.aar` de debug y release son archivos distintos — el debug no los deja en caché. Si la red falla durante la descarga, Gradle aborta.

**Solución A — APK debug con bundle JS embebido** (evita descargar los `.aar` de release):

```powershell
# Desde E:\Ormuz-app (raíz del proyecto)
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
New-Item -ItemType Directory -Force -Path android\app\src\main\assets
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android\app\src\main\assets\index.android.bundle --assets-dest android\app\src\main\res
cd android
.\gradlew assembleDebug
```

APK generado en `android\app\build\outputs\apk\debug\app-debug.apk`. Funciona sin Metro y con JS de producción.

**Solución B — Reintentar `assembleRelease`** cuando la red esté estable. Gradle retoma desde donde se quedó:

```powershell
.\gradlew assembleRelease
```

Los timeouts ya están ampliados a 5 minutos en `gradle.properties`.

---

### `npx` bloqueado por PowerShell — "la ejecución de scripts está deshabilitada"

```
npx : No se puede cargar el archivo npx.ps1 porque la ejecución de scripts está deshabilitada en este sistema.
```

**Causa**: La política de ejecución de PowerShell bloquea scripts `.ps1` de terceros por defecto en Windows.

**Solución** (solo afecta a la sesión actual, no cambia la política global):

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Ejecuta esto una vez al abrir PowerShell antes de usar `npx`, `npm`, etc.

---

### `./gradlew` no reconocido como comando

```
El término './gradlew' no se reconoce como nombre de un cmdlet...
```

**Causa**: En PowerShell, `./` solo funciona si estás en la carpeta correcta. Este error suele ocurrir por estar en `E:\Ormuz-app\android\android` (doble `android`) en vez de `E:\Ormuz-app\android`.

**Solución**: Verifica la ruta y usa `.\gradlew` (barra invertida) en PowerShell:

```powershell
cd E:\Ormuz-app\android
.\gradlew assembleDebug
```

---

### Dónde encontrar los APKs generados

| Tipo | Ruta |
|------|------|
| Debug (con bundle embebido) | `android\app\build\outputs\apk\debug\app-debug.apk` |
| Release | `android\app\build\outputs\apk\release\app-release.apk` |

Instalar en dispositivo conectado:

```powershell
adb install android\app\build\outputs\apk\release\app-release.apk
```

---

## Dependencias principales

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `react-native` | 0.84.1 | Framework móvil |
| `@maplibre/maplibre-react-native` | ^11.0.0-beta.21 | Mapa vectorial (OpenStreetMap) |
| `react-native-geolocation-service` | ^5.3.1 | GPS del dispositivo |
| `react-native-permissions` | ^5.5.1 | Gestión de permisos Android |
| `@gorhom/bottom-sheet` | ^5.2.8 | Sheet de detalle de estación |
| `react-native-reanimated` | ^4.2.3 | Animaciones |
| `react-native-gesture-handler` | ^2.30.0 | Gestos táctiles |
| `@react-native-async-storage/async-storage` | ^3.0.1 | Caché local por provincia |
| `react-native-safe-area-context` | ^5.5.2 | Safe area (notch) |
| `react-native-worklets` | ^0.8.1 | Requerido por reanimated v4 |

**Tiles del mapa**: [OpenFreeMap](https://openfreemap.org/) — sin API key, gratuito.

---

## Documentación adicional

- [CHANGELOG.md](CHANGELOG.md) — historial de cambios (Keep a Changelog).
- [CONTRIBUTING.md](CONTRIBUTING.md) — cómo montar el entorno y abrir un PR.
- [SECURITY.md](SECURITY.md) — política de divulgación y SLA.
- [ATTRIBUTION.md](ATTRIBUTION.md) — atribuciones a OpenStreetMap (ODbL), OpenFreeMap y Ministerio de Industria.

---

## Licencia

MIT — ver [LICENSE](LICENSE).

Map data © OpenStreetMap contributors, licensed under
[ODbL](https://opendatacommons.org/licenses/odbl/) — ver
[ATTRIBUTION.md](ATTRIBUTION.md) para el detalle completo.

---

> Vibecoded con Claude Code · [Anthropic](https://anthropic.com)
