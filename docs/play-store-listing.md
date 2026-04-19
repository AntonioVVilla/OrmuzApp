# Google Play Store — Ficha para OrmuzApp

Este documento es el **borrador revisable** con todos los textos y
metadatos que hay que copiar/pegar en Google Play Console al subir
la app por primera vez.

Cada sección está calibrada al límite de caracteres que Play impone
(contado de forma estricta: un emoji cuenta 2, un acento cuenta 1).

---

## 1. Datos básicos del listado

| Campo | Valor propuesto |
|---|---|
| **App name** (máx. 50 chars) | `Ormuz: Precios gasolineras España` |
| **Default language** | Español (España) — `es-ES` |
| **App or game** | App |
| **Free or paid** | Free |
| **Category (primary)** | Maps & Navigation |
| **Category (secondary)** | Auto & Vehicles |
| **Tags** (elige hasta 5 en la UI) | Fuel prices · Gas stations · Road trip · Navigation · Spain |
| **Developer contact — email** | soporte@gesturcanarias.es |
| **Developer contact — website** | https://antoniovvilla.github.io/OrmuzApp/ |
| **Developer contact — phone** | *(opcional; déjalo vacío si prefieres)* |
| **Privacy policy URL** | https://antoniovvilla.github.io/OrmuzApp/privacy/ |

**Conteo del nombre**: `Ormuz: Precios gasolineras España` = 33 chars
(margen cómodo por si quieres alargar a `Ormuz: Precios Gasolineras
España · Mapa` → 47 chars).

---

## 2. Descripción corta (máx. 80 chars)

### Español (primaria)

```
Precios oficiales de gasolineras en España: encuentra la más barata cerca de ti.
```

79 chars ✓

### Inglés (opcional, para el mercado internacional)

```
Official fuel prices across Spain — find the cheapest station near you.
```

71 chars ✓

---

## 3. Descripción larga (máx. 4000 chars)

### Español

```
Ormuz es el mapa de precios de gasolineras de España que usa los
datos oficiales del Ministerio de Industria, Comercio y Turismo —
los mismos que consultan los comparadores profesionales— y los
actualiza automáticamente en tu dispositivo.

🛢️ Mapa con todas las estaciones cercanas
Al abrir la app ves un mapa centrado en tu posición con todas las
gasolineras de tu provincia. Cada estación aparece coloreada según
lo barata que esté respecto al mínimo y máximo de tu radio de
búsqueda, así que de un vistazo detectas la oferta.

⛽ Filtrado por combustible
Gasolina 95, Gasolina 98, Diésel, Diésel Premium, GLP, GNC, GNL,
hidrógeno, bioetanol... Selecciona tu combustible en el selector
superior y la app recalcula precios, colores y distancias al
instante.

📍 Distancia real desde donde estás
Usamos tu ubicación precisa (solo mientras la app está abierta,
nunca en segundo plano) para ordenar las estaciones por cercanía y
calcular exactamente cuántos kilómetros hay a cada una. Si
rechazas el permiso seguimos funcionando con Madrid por defecto.

🧭 Cómo llegar en Google Maps, Waze o tu navegador
Toca cualquier estación y elige la app de navegación que prefieras:
Google Maps con ruta precalculada, Waze con alertas de tráfico en
tiempo real, o el gestor de mapas del sistema. Si no tienes la app
instalada abrimos la versión web automáticamente.

📡 Funciona sin cobertura
La última consulta se guarda en caché local, así que si entras en
una zona sin conexión sigues viendo las gasolineras y sus precios
de la última actualización. Un distintivo te avisa de que estás
viendo datos en modo offline.

🔒 Privacidad real, no palabrería
· Sin cuentas de usuario.
· Sin publicidad.
· Sin analítica.
· Sin seguimiento entre apps.
· Tu ubicación nunca sale de tu dispositivo.
· Código abierto y auditable en GitHub.

Los datos cartográficos provienen de OpenStreetMap (ODbL 1.0) y
OpenFreeMap. Los precios se obtienen del catálogo público del
Ministerio de Industria. Ormuz no está afiliado al Ministerio ni a
ninguna compañía petrolera.

💻 ¿Quieres revisar el código?
Toda la aplicación es software libre publicado en:
https://github.com/AntonioVVilla/OrmuzApp

Si encuentras un fallo o quieres proponer una mejora, abre una
issue en el repositorio o escríbenos a soporte@gesturcanarias.es.

—

Desarrollado en Canarias con React Native, MapLibre y cariño.
```

Conteo aproximado: ~2.600 chars (margen de 1.400 chars).

### Inglés

```
Ormuz is the fuel-price map of Spain that uses the official data
from the Spanish Ministry of Industry — the same source
professional comparators rely on — refreshed automatically on your
device.

🛢️ Map of every station nearby
When you open the app you see a map centred on your position with
every fuel station in your province. Each station is coloured
according to how cheap it is against the minimum and maximum in
your search radius, so the best deals stand out at a glance.

⛽ Filter by fuel type
Gasoline 95, Gasoline 98, Diesel, Premium Diesel, LPG, CNG, LNG,
hydrogen, bioethanol... Pick yours in the top selector and the app
recalculates prices, colours and distances instantly.

📍 Real distance from wherever you are
We use your precise location (foreground only, never in the
background) to sort stations by closeness and compute the exact
kilometres to each one. If you decline the permission the app
falls back to Madrid.

🧭 Directions in Google Maps, Waze or the system's maps
Tap any station and pick your preferred navigation app: Google
Maps with a pre-built route, Waze with live traffic alerts, or the
system's default geo handler. If the app isn't installed we fall
back to the web version automatically.

📡 Works without signal
The last fetch is cached locally, so when you enter a coverage
dead-zone the stations and prices from the most recent update are
still there. A badge tells you you're looking at offline data.

🔒 Real privacy, not lip service
· No user accounts.
· No ads.
· No analytics.
· No cross-app tracking.
· Your location never leaves your device.
· Open source and auditable on GitHub.

Map data © OpenStreetMap contributors, licensed under ODbL 1.0.
Tiles by OpenFreeMap. Prices from the Spanish Ministry of
Industry's public catalogue. Ormuz is not affiliated with the
Ministry nor with any fuel company.

💻 Review the code
The whole app is free and open-source software published at:
https://github.com/AntonioVVilla/OrmuzApp

If you find a bug or want to propose an improvement, open an issue
in the repository or email soporte@gesturcanarias.es.

—

Built in the Canary Islands with React Native, MapLibre and care.
```

---

## 4. Data safety — respuestas al formulario

Play Console te obliga a rellenar un cuestionario en vivo. Estas son
las respuestas que se ajustan a lo que la app realmente hace:

- **Does your app collect or share any of the required user data types?**
  → **No**.

- Si pregunta específicamente por **Location (approximate / precise)**:
  - Collected? → **Yes, precise**.
  - Shared with third parties? → **No**.
  - Processed ephemerally or persisted? → **Processed ephemerally**
    (solo en memoria mientras la app está activa).
  - Is collection required? → **Optional** — la app funciona sin el
    permiso, usando Madrid por defecto.
  - Purpose? → **App functionality** (centrar mapa y ordenar por
    distancia).

- **Security practices**
  - Data encrypted in transit? → **Yes** (HTTPS para todas las
    peticiones al MINETUR y a OpenFreeMap).
  - Users can request data deletion? → **Yes** — desde los Ajustes
    del sistema borrando los datos de la app.

- **Data types collected** → Solo `Location (precise)`.

---

## 5. Classification content rating (IARC)

El cuestionario IARC preguntará por violencia, sexo, drogas, etc.
Todas las respuestas son **"No"** para OrmuzApp.

La categoría resultante será probablemente **PEGI 3 / Everyone**.

---

## 6. Target audience and content

- **Target audience (age)** → `18 y más` es lo más seguro porque
  la app muestra precios de combustible y no va dirigida a menores.
  Si quieres llegar también al público general, elige
  `13 y más` — no cambia nada material y evita el flujo
  obligatorio de "Families Policy".

---

## 7. App access (¿la app tiene contenido restringido?)

- **All functionality is available without special access** →
  **Yes**. No hay login, no hay zona premium.

---

## 8. Ads

- **Does your app contain ads?** → **No**.

---

## 9. Release notes para la primera publicación (máx. 500 chars)

### Español

```
¡Primera versión pública de Ormuz en Google Play! 🚀

• Mapa con todas las gasolineras de tu provincia, coloreadas por
  precio.
• Filtro por tipo de combustible (gasolina, diésel, GLP, etc.).
• Cálculo de distancia desde tu ubicación en tiempo real.
• Botones para abrir ruta en Google Maps, Waze o el sistema.
• Funciona sin conexión con el último caché.
• Sin cuentas, sin anuncios, sin tracking.

Datos oficiales del Ministerio de Industria.
```

### Inglés

```
First public release of Ormuz on Google Play! 🚀

• Map of every fuel station in your province, colour-coded by
  price.
• Filter by fuel type (gasoline, diesel, LPG, CNG, etc.).
• Real-time distance from your location.
• Open directions in Google Maps, Waze or the system's maps.
• Works offline with the latest cached data.
• No accounts, no ads, no tracking.

Official data from the Spanish Ministry of Industry.
```

---

## 10. Assets gráficos

Screenshots iniciales ya capturados desde Vivo V2427 (Android 16,
1080 × 2392) en [`docs/screenshots/`](./screenshots/):

| Archivo | Qué muestra |
|---|---|
| `01-map-overview.png` | Mapa con estaciones cercanas del norte de Tenerife coloreadas por precio, chips de combustible arriba, brújula visible, selector de radio abajo. |
| `02-tenerife-cluster.png` | Vista más amplia con la isla de Tenerife y un cluster de 4-5 gasolineras en Granadilla de Abona. Buena para destacar contexto geográfico. |
| `03-station-detail.png` | Sheet de detalle de estación (REPSOL Carretera Vieja) con precios desglosados por combustible y los tres botones de navegación (Google Maps · Waze · Sistema). |

Pendientes de producir para la subida inicial a Play:

- **App icon** 512 × 512 PNG (32-bit, sin transparencia, no rounded
  corners — Play los aplica). Se puede extraer del XML del launcher.
- **Feature graphic** 1024 × 500 PNG/JPEG. Banner hero que aparece
  arriba del listado.
- **Phone screenshots** extra opcionales (2–8 en total). Los 3 que
  ya tenemos cumplen el mínimo, pero se puede añadir: captura con
  otro combustible seleccionado (p.ej. Gasolina 95) para mostrar
  el cambio de paleta, o captura del diálogo de atribución OSM
  (**requiere build v1.1.4+**, ver nota abajo).
- **Tablet screenshots** (opcional, recomendable):
  - 7″: min 320 px / max 3840 px
  - 10″: min 320 px / max 3840 px

> **Nota v1.1.4 pendiente.** En v1.1.3 se detectó que el icono nativo
> de atribución de MapLibre quedaba oculto detrás del pill flotante
> de "Radio" (el `SeekBar` interceptaba el tap y el usuario no podía
> abrir el diálogo de "© OpenStreetMap contributors"). Se reposiciona
> a `{bottom: 8, right: 8}` en v1.1.4. **Conviene subir la v1.1.4 a
> Play antes de la publicación pública** para no arrastrar el
> incumplimiento ODbL.

---

## 11. Checklist final antes de publicar

- [ ] Cuenta de Play Console verificada (DNI + 25 USD pagados).
- [ ] AAB v1.1.3+ firmado con la upload key subido al track Internal.
- [ ] Política de privacidad accesible en https (GitHub Pages publicado).
- [ ] Descripción corta + larga en ES (y opcionalmente EN).
- [ ] 4+ screenshots reales del dispositivo subidos.
- [ ] Feature graphic diseñado y subido.
- [ ] Icono 512×512 subido.
- [ ] Data safety form completado.
- [ ] Content rating (IARC) obtenido.
- [ ] Target audience configurado.
- [ ] Ads question respondido: No.
- [ ] Play App Signing activado (Play genera la app signing key).
- [ ] Al menos un tester invitado al track Internal (tu propio email).
- [ ] Smoke-test en Internal: instalar desde Play Store y validar
      permisos + mapa + botones nav + brújula.
