# Changelog

Formato: [Keep a Changelog](https://keepachangelog.com/) + SemVer.

## [0.2.0] - 2026-05-06

### Added
- `README.md`, `VERSION` y `CHANGELOG.md` en la raíz del blueprint.
- `ai-instructions/rule-severity.md` con sistema de severidad BLOCKER / STRICT / GUIDE.
- `design-system/spacing.md` y `design-system/radius-elevation.md` con tokens concretos.
- `design-system/theme.example.ts` listo para copiar a un proyecto MUI.
- `docs/conventions/naming.md`, `http-errors.md`, `api-error-format.md`, `pagination.md`, `dates-timezones.md`, `money.md`.
- `docs/observability/logging.md`.
- `docs/uploads/file-uploads.md`.
- `docs/accessibility/a11y-rules.md` (WCAG 2.1 AA concreto).
- `templates/prompts/create-new-endpoint.md`, `create-new-migration.md`, `bug-fix.md`, `refactor.md`.
- `templates/checklists/code-review-checklist.md`, `definition-of-done.md`.

### Changed
- `00-start-here/antigravity-master-prompt.md`: ahora carga **todos** los archivos
  del blueprint y declara severidad de reglas. Antes faltaban git, deployment,
  frontend, backend, mobile.
- `design-system/colors.md`: agrega paleta hex concreta (light + dark) y mapeo a tokens MUI.
- `design-system/typography.md`: escala completa con line-height, weight y uso recomendado.
- `templates/files/env.example.md`: variables de Google OAuth, refresh token, rate limit y log level.
- `docs/deployment/deployment-rules.md`: deduplica HTTPS y referencia el checklist de DoD.

### Notes
- Estructura de carpetas y filosofía base se mantienen.
- Ningún archivo existente fue eliminado; todo el v0.1 sigue válido.

## [0.1.0]

Versión inicial entregada por el equipo.
