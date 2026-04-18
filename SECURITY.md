# Security Policy

## Supported versions

OrmuzApp ships as a standalone Android APK. Solo la última
release publicada en [GitHub Releases](https://github.com/AntonioVVilla/OrmuzApp/releases)
recibe parches de seguridad. Versiones anteriores quedan
archivadas tal cual.

## Reporting a vulnerability

Si has encontrado un fallo de seguridad, **no abras un issue
público**. Envía un correo cifrado o sin cifrar a:

**antoniovvilla@users.noreply.github.com**

Incluye, si es posible:

- Descripción del problema y su impacto potencial.
- Pasos para reproducirlo (versión exacta del APK, dispositivo,
  Android version).
- Logs, capturas o PoC en forma reducida.
- Si tienes una propuesta de mitigación, mejor.

### SLA

| Evento | Plazo objetivo |
|--------|---------------|
| Acuse de recibo | 72 h desde el email |
| Evaluación inicial | 7 días naturales |
| Fix o mitigación publicada | 30 días según gravedad (CVSS) |

No ofrecemos bug bounty. Reconocimiento público en el
CHANGELOG y en las notas de release si así lo deseas.

## Scope

Dentro de scope:

- Exfiltración de datos del usuario (ubicación, caché local).
- Ejecución remota de código vía payload de la API.
- Elusión de validación de respuestas (schemas).
- Fallos de firma / integridad de los APKs publicados.
- Leaks de credenciales en artefactos (mapping, SBOM, Docker
  image, logs de CI).

Fuera de scope:

- Problemas en la API del Ministerio (reportar directamente al
  MITECORD).
- Problemas en los tiles de OpenFreeMap o datos de OSM
  (reportar en sus respectivos proyectos).
- Denial of service por spam al endpoint ministerial.
- Vulnerabilidades que requieran acceso físico al dispositivo
  ya desbloqueado.

## Hardening ya aplicado

- Validación runtime de la respuesta API y del caché con
  [zod](https://zod.dev/). Respuestas malformadas o cachés
  corruptos se rechazan sin crashear la app.
- `ErrorBoundary` global con CTA de reintento.
- `cleartextTrafficPermitted=false` a nivel global + dominios
  específicos en el network security config de Android.
- ProGuard/R8 activados en release builds, con `mapping.txt`
  publicado para symbolicar crashes sin renunciar a la
  obfuscación.
- Firma de release con keystore dedicada; si las credenciales
  no están presentes, el build emite un warning y usa la
  keystore de debug (nunca publica un APK sin firmar
  accidentalmente).
- CI con CodeQL (security-and-quality), gitleaks (secret
  scanning histórico) y Dependabot semanal.
- Docker image de build con usuario no-root y sin credenciales
  en capas (inyectadas vía BuildKit `--mount=type=secret`).

## Datos personales

La app procesa tu ubicación GPS únicamente en el dispositivo
para determinar la provincia española más cercana. No se envía
a servidores propios — solo al endpoint público del
Ministerio, y únicamente el ID numérico de la provincia.
