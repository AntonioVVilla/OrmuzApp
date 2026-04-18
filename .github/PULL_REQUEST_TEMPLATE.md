<!--
  Gracias por contribuir. Rellena las secciones aplicables;
  borra las que no.
-->

## Resumen

<!-- 1–3 frases: qué cambia y por qué. -->

## Issues relacionados

<!-- Closes #123, Refs #456, o "N/A" si no aplica. -->

## Tipo de cambio

- [ ] `fix` — arregla un bug
- [ ] `feat` — funcionalidad nueva
- [ ] `chore` / `build` / `ci` / `docs`
- [ ] `perf` / `refactor`
- [ ] `test`
- [ ] Breaking change (requiere nota en CHANGELOG y versión mayor)

## Test plan

<!-- Cómo has verificado el cambio. Comandos ejecutados, dispositivos
     probados, pantallas afectadas. Marca lo completado. -->

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm test -- --coverage`
- [ ] `cd android && ./gradlew :app:assembleDebug` corre sin warnings
      nuevos.
- [ ] Probado en un dispositivo o emulador real (indica cuál).

## Capturas / vídeo

<!-- Si tocas UI, adjunta antes/después. -->

## Accesibilidad

- [ ] Nuevos controles interactivos llevan `accessibilityLabel` y
      `accessibilityRole`.
- [ ] Strings visibles pasan por `t('...')` (i18n).
- [ ] Contraste verificado (o `contrastTextColor` aplicado) en
      elementos con fondo coloreado.

## Checklist

- [ ] Commit messages siguen [Conventional Commits](https://www.conventionalcommits.org/).
- [ ] `CHANGELOG.md` actualizado bajo `[Unreleased]` si el cambio
      es visible para el usuario o para quien opere releases.
- [ ] No se añaden secretos ni credenciales al repo (gitleaks lo
      comprobará igualmente).
