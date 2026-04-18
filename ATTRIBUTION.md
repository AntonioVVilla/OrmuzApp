# Attribution / Atribuciones

OrmuzApp muestra cartografía derivada de datos comunitarios y
consume servicios públicos. Esta página documenta las
atribuciones exigidas por las licencias correspondientes.

---

## Map data © OpenStreetMap contributors

El mapa base utiliza datos de **OpenStreetMap**, licenciados bajo
la **Open Database License (ODbL)** v1.0.

- Fuente: <https://www.openstreetmap.org/>
- Licencia: <https://opendatacommons.org/licenses/odbl/>
- Copyright page: <https://www.openstreetmap.org/copyright>

> © OpenStreetMap contributors — Los datos del mapa están
> disponibles bajo la Open Database License. La cartografía
> correspondiente está disponible bajo la Creative Commons
> Attribution-ShareAlike 2.0 license (CC BY-SA 2.0).

La atribución se muestra también de forma visible dentro de la
app, en la esquina inferior izquierda del mapa (`attribution=true`
en `src/components/Map/MapView.tsx`).

---

## Map tiles — OpenFreeMap

Los tiles vectoriales se sirven desde **OpenFreeMap**, que
redistribuye estilos basados en datos de OpenStreetMap sin
requerir API key ni registro.

- Proyecto: <https://openfreemap.org/>
- Estilo aplicado: **Liberty**
- Tile URL (configurado en `src/utils/constants.ts`):
  `https://tiles.openfreemap.org/styles/liberty`

---

## Datos de precios de combustible

La información de estaciones de servicio y precios proviene del
**Ministerio para la Transición Ecológica y el Reto Demográfico**
(Gobierno de España), a través de su API pública de carburantes.

- Endpoint raíz:
  `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/`
- Endpoint utilizado: `EstacionesTerrestres/FiltroProvincia/{ID}`
- Condiciones de uso: datos abiertos reutilizables en los
  términos de la [Ley 37/2007](https://www.boe.es/buscar/doc.php?id=BOE-A-2007-19814)
  sobre reutilización de la información del sector público.

No modificamos, redistribuimos ni almacenamos permanentemente
los datos fuera del caché local del dispositivo (TTL
configurado en `src/utils/constants.ts`).

---

## Iconografía y tipografías

- Iconos del sistema: emojis nativos del sistema operativo.
- Tipografía: system default (San Francisco en iOS, Roboto en
  Android).

No se embebe ninguna tipografía de terceros.

---

## Software de terceros

La lista completa de dependencias runtime y sus licencias se
genera como Software Bill of Materials (SPDX 2.3) en cada
release y se adjunta como artefacto al Release
correspondiente. Ver `sbom-<version>.spdx.json`.

Licencias detectadas en el árbol de dependencias (informativo,
no exhaustivo):

- **MIT** — React Native, React, zod, i18next, react-i18next,
  react-native-localize, @gorhom/bottom-sheet.
- **ISC** — varias utilidades Node.js.
- **BSD-2-Clause / BSD-3-Clause** — algunas dependencias
  transitivas.
- **Apache-2.0** — @maplibre/maplibre-react-native.

Consulta el SBOM de la release que estés ejecutando para la
lista autoritativa.
