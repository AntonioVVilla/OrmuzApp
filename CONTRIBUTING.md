# Contributing to OrmuzApp

¡Gracias por tu interés en contribuir! Esta guía cubre los
flujos de trabajo habituales para aportar código, bugs o
traducciones.

---

## Requisitos previos

| Herramienta | Versión | Notas |
|-------------|---------|-------|
| **Node.js** | ≥ 22.11.0 | <https://nodejs.org/> |
| **JDK** | 17 LTS | [Temurin 17](https://adoptium.net/) |
| **Android SDK** | 36 | Android Studio → SDK Manager |
| **NDK** | 27.1.12297006 | SDK Manager → SDK Tools |

Opcional pero recomendado:

- **pre-commit** o `husky` (no los forzamos, pero el equipo los
  usa localmente).
- **Docker** + BuildKit si prefieres compilar el APK en un
  entorno aislado (ver [Dockerfile](Dockerfile)).

---

## Primer arranque

```bash
git clone https://github.com/AntonioVVilla/OrmuzApp.git
cd OrmuzApp
npm ci
npm run android   # requiere emulador o dispositivo conectado
```

Si algo no arranca, `npx react-native doctor` suele dar la
pista correcta antes de abrir un issue.

---

## Flujo de trabajo

1. **Abre un issue primero** para cambios con impacto visible
   (UX, API pública, nuevas dependencias). Para bugs pequeños
   puedes ir directo al PR.
2. Crea una rama desde `master`:
   - `feat/<nombre-corto>` para features.
   - `fix/<nombre-corto>` para bugs.
   - `chore/<nombre-corto>` para build/CI/docs.
3. Commits en [Conventional Commits](https://www.conventionalcommits.org/):
   `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `perf:`,
   `refactor:`, `build:`, `ci:`.
4. Antes de empujar, corre la suite local:

   ```bash
   npm run lint
   npm run typecheck
   npm test -- --coverage
   ```

5. Abre el PR contra `master`. La plantilla te pedirá
   contexto, test plan y capturas si aplica. CI correrá
   automáticamente (lint, typecheck, tests, APK debug).
6. Dependabot y CodeQL también votan. Un reviewer humano
   (CODEOWNERS) aprobará o pedirá cambios.

---

## Convenciones de código

- **TypeScript estricto** (`tsconfig.json` con `strict: true`).
  Sin `any` salvo justificación en comentario adyacente.
- **ESLint** (`@react-native/eslint-config`). `npm run lint --fix`
  para autocorregir.
- **Formato**: Prettier por defecto (no lo forzamos en CI de
  momento, pero ayuda al reviewer).
- **i18n**: cualquier string visible al usuario va en
  [src/i18n/locales/](src/i18n/locales/). No hardcodees
  español/inglés en componentes. Las claves siguen
  `categoria.elemento.variante` (por ejemplo
  `searchRadius.decrease`).
- **a11y**: todo elemento interactivo lleva `accessibilityRole`
  y `accessibilityLabel` (o `accessibilityLabelledBy`). Para
  controles con valor (slider, switch), añade
  `accessibilityValue`.
- **Tests**: util/service nuevo → test unitario obligatorio.
  Hook nuevo → test con `@testing-library/react-hooks` o
  `react-test-renderer`.
- **Comentarios**: explica *por qué* cuando el motivo no es
  evidente. No repitas lo que el código ya dice por sí solo.

---

## Tests

Stack:

- **Jest** como runner (`preset: 'react-native'`).
- **react-test-renderer** para renderizados de árbol.
- Mock global de AsyncStorage y módulos nativos en
  `jest.setup.js` (no lo dupliques por test).

Umbrales de cobertura (configurados en `jest.config.js`):

- Branches: 60 %
- Functions: 50 %
- Lines: 60 %
- Statements: 60 %

El PR no mergea si bajas los umbrales sin justificación.

Ejecución:

```bash
npm test                      # todos los tests
npm test -- --coverage        # con reporte
npm test -- colors.test.ts    # filtrar por nombre
```

---

## Traducciones

Para añadir un idioma nuevo:

1. Copia `src/i18n/locales/es.json` a
   `src/i18n/locales/<codigo>.json`.
2. Tradúcelo manteniendo las mismas claves.
3. Regístralo en `src/i18n/index.ts` bajo `resources`.
4. Opcional: añade el código a
   `languageDetector.detect()` si necesitas un mapeo
   específico.

---

## Releases

- Commits a `master` disparan `ci.yml` (lint, typecheck, test,
  APK debug). No generan releases.
- Un tag `v<MAJOR>.<MINOR>.<PATCH>` dispara `release.yml`, que
  firma el APK, genera SBOM y publica la release en GitHub.
- Antes de taguear, mueve lo que esté en
  `CHANGELOG.md#Unreleased` a una sección versionada con la
  fecha.
- Asegúrate de que los secretos de firma
  (`RELEASE_KEYSTORE_BASE64`, `RELEASE_STORE_PASSWORD`,
  `RELEASE_KEY_ALIAS`, `RELEASE_KEY_PASSWORD`) están
  configurados en el repo.

---

## Reporte de bugs y features

Usa las plantillas:

- [Bug report](.github/ISSUE_TEMPLATE/bug_report.yml)
- [Feature request](.github/ISSUE_TEMPLATE/feature_request.yml)

Si es un problema de seguridad, sigue
[SECURITY.md](SECURITY.md) — no abras issue público.

---

## Licencia de tus contribuciones

Al abrir un PR aceptas que tu contribución se publique bajo la
misma licencia que el resto del proyecto ([MIT](LICENSE)).
