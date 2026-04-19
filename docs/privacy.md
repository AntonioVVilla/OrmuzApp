---
layout: null
title: Política de privacidad — OrmuzApp
permalink: /privacy/
---

# Política de privacidad de OrmuzApp

_Última actualización: 19 de abril de 2026_

Esta política describe cómo la aplicación **OrmuzApp** ("la app",
"nosotros") trata la información cuando la utilizas. La app está
publicada por **Gestur Canarias** (contacto:
<soporte@gesturcanarias.es>) y es software gratuito sin publicidad,
sin cuentas de usuario y sin seguimiento de terceros.

OrmuzApp es una consulta local del catálogo público de precios de
combustible en España, servido por el Ministerio de Industria,
Comercio y Turismo (<https://geoportalgasolineras.es>).

---

## 1. Qué datos recopilamos

### 1.1. Ubicación precisa (`ACCESS_FINE_LOCATION`)

- **Por qué** — Para calcular localmente la provincia en la que te
  encuentras y la distancia a las gasolineras, y para centrar el mapa
  en tu posición actual.
- **Cuándo** — Solo mientras la app está abierta y en primer plano.
  No accedemos a tu ubicación en segundo plano.
- **Cómo se guarda** — La coordenada actual permanece únicamente en
  memoria mientras usas la app. No se escribe a disco, no se envía a
  ningún servidor nuestro y no se sincroniza entre dispositivos.
- **Quién la recibe** — Nadie. El cálculo de proximidad se hace
  íntegramente en el dispositivo.

Si rechazas el permiso, la app sigue funcionando mostrando por
defecto las gasolineras de Madrid; no se pierde ninguna funcionalidad
más allá del centrado automático.

### 1.2. Preferencias locales de uso

La app guarda en el almacenamiento del dispositivo un pequeño caché
para funcionar sin red:

- El último listado de gasolineras consultado por provincia
  (identificador, nombre, dirección, precios, horario).
- El tipo de combustible que seleccionaste por última vez.
- El radio de búsqueda que elegiste.

Estos datos se almacenan con `AsyncStorage` de React Native, se
borran al desinstalar la app y **no salen del dispositivo**.

### 1.3. Lo que NO recopilamos

- No usamos analítica (no Firebase Analytics, no Google Analytics,
  no Mixpanel, etc.).
- No mostramos anuncios ni integramos SDKs publicitarios.
- No te pedimos email, contraseña, nombre ni ningún dato personal.
- No registramos tu historial de consultas.
- No hacemos seguimiento entre apps ni asociamos identificadores
  publicitarios.

---

## 2. Conexiones de red

La app realiza peticiones HTTPS solo a dos dominios:

1. **`sedeaplicaciones.minetur.gob.es`** — API pública oficial del
   Ministerio de Industria, Comercio y Turismo, desde donde se
   obtienen los precios y ubicaciones de las gasolineras.

2. **`tiles.openfreemap.org`** — Servidor de cartografía
   [OpenFreeMap](https://openfreemap.org/) para los tiles del mapa,
   basado en datos de [OpenStreetMap](https://www.openstreetmap.org/).

No enviamos tu ubicación ni ningún dato personal a ninguno de estos
servicios. Las peticiones son anónimas: el servidor solo ve la
dirección IP desde la que te conectas, como cualquier otra petición
web desde el dispositivo.

Los datos de OpenStreetMap se distribuyen bajo la
[Open Database License (ODbL) 1.0](https://opendatacommons.org/licenses/odbl/1-0/).
La atribución requerida ("© OpenStreetMap contributors") se muestra
en la propia pantalla del mapa dentro de la app.

---

## 3. Cómo puedes ejercer tus derechos

Como no recopilamos datos personales identificables, no hay un perfil
que consultar, corregir, portar o eliminar. Los únicos datos
asociados a ti son los almacenados localmente en tu dispositivo, que
puedes borrar en cualquier momento:

- **Borrar el caché**: Ajustes del sistema → Aplicaciones → OrmuzApp
  → Almacenamiento → "Borrar datos".
- **Revocar el permiso de ubicación**: Ajustes del sistema →
  Aplicaciones → OrmuzApp → Permisos → Ubicación → "No permitir".
- **Desinstalar la app**: elimina todos los datos locales.

Si aun así quieres contactar con nosotros por cualquier cuestión
relacionada con esta política o con el RGPD, escríbenos a
<soporte@gesturcanarias.es>. Respondemos en un plazo máximo de 30
días naturales.

---

## 4. Menores

La app no está dirigida a menores de 13 años, pero tampoco recopila
ningún dato que permita identificar al usuario, por lo que su uso por
menores no implica tratamiento de datos personales.

---

## 5. Cambios a esta política

Si actualizamos esta política publicaremos la nueva versión en esta
misma URL con una fecha de "Última actualización" visible arriba. Los
cambios relevantes se comunicarán también en el changelog de la app.

---

## 6. Marco legal aplicable

- Reglamento (UE) 2016/679 (RGPD)
- Ley Orgánica 3/2018, de Protección de Datos Personales y Garantía
  de los Derechos Digitales (LOPDGDD)

Autoridad de control competente: Agencia Española de Protección de
Datos (<https://www.aepd.es>).

---

## 7. Contacto

- **Responsable**: Gestur Canarias
- **Email**: <soporte@gesturcanarias.es>
- **Código fuente**: <https://github.com/AntonioVVilla/OrmuzApp>
- **Informe de vulnerabilidades**: ver [`SECURITY.md`](https://github.com/AntonioVVilla/OrmuzApp/blob/master/SECURITY.md)
