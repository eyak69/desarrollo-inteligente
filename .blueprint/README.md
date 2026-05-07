# Blueprint Antigravity — Guía de inicio

Este directorio contiene todos los estándares, reglas y convenciones del proyecto.
Antes de escribir una sola línea de código, leer este archivo.

---

## Primer día en el proyecto

→ [00-start-here/day-one.md](00-start-here/day-one.md) — setup del entorno, tsconfig, pre-commit hooks, checklist de día 1.

---

## ¿Qué es el Blueprint?

El Blueprint es el contrato técnico del equipo. Define qué hacer, cómo hacerlo, y qué está prohibido.
No es sugerencias: las reglas `[BLOCKER]` son innegociables y `[STRICT]` requieren aprobación explícita para desviarse.

Ver sistema de severidad completo: [ai-instructions/rule-severity.md](ai-instructions/rule-severity.md)

---

## Orden de lectura obligatorio para nuevos desarrolladores

### 1. Instrucciones de IA y reglas operativas (10 min)
1. [00-start-here/antigravity-master-prompt.md](00-start-here/antigravity-master-prompt.md)
2. [ai-instructions/ai-operating-rules.md](ai-instructions/ai-operating-rules.md)
3. [ai-instructions/rule-severity.md](ai-instructions/rule-severity.md)

### 2. Stack y arquitectura (15 min)
4. [project-standards/stack.md](project-standards/stack.md) — qué tecnologías usamos y cuáles están prohibidas
5. [project-standards/architecture.md](project-standards/architecture.md) — estructura de carpetas y reglas de capas

### 3. Seguridad — leer antes de tocar código (10 min)
6. [docs/security/security-rules.md](docs/security/security-rules.md)
7. [docs/security/owasp-checklist.md](docs/security/owasp-checklist.md)

### 4. Reglas técnicas por capa (30 min)
8. [docs/frontend/frontend-rules.md](docs/frontend/frontend-rules.md)
9. [docs/backend/backend-rules.md](docs/backend/backend-rules.md)
10. [docs/database/database-rules.md](docs/database/database-rules.md)
11. [docs/architecture/repository-rules.md](docs/architecture/repository-rules.md)
12. [docs/mobile/mobile-rules.md](docs/mobile/mobile-rules.md)

### 5. Convenciones transversales (20 min)
13. [docs/conventions/naming.md](docs/conventions/naming.md)
14. [docs/conventions/api-error-format.md](docs/conventions/api-error-format.md)
15. [docs/conventions/http-errors.md](docs/conventions/http-errors.md)
16. [docs/conventions/pagination.md](docs/conventions/pagination.md)
17. [docs/conventions/dates-timezones.md](docs/conventions/dates-timezones.md)
18. [docs/conventions/money.md](docs/conventions/money.md)

### 6. Design system (15 min)
19. [design-system/design-principles.md](design-system/design-principles.md)
20. [design-system/colors.md](design-system/colors.md)
21. [design-system/typography.md](design-system/typography.md)
22. [design-system/spacing.md](design-system/spacing.md)
23. [design-system/components.md](design-system/components.md)
24. [design-system/layout.md](design-system/layout.md)
25. [design-system/grid-rules.md](design-system/grid-rules.md)
26. [design-system/mobile-first.md](design-system/mobile-first.md)

### 7. Calidad, UI y plataforma (20 min)
27. [docs/testing/testing-rules.md](docs/testing/testing-rules.md)
28. [docs/ui/notification-rules.md](docs/ui/notification-rules.md)
29. [docs/accessibility/a11y-rules.md](docs/accessibility/a11y-rules.md)
30. [docs/performance/performance-rules.md](docs/performance/performance-rules.md)
31. [docs/observability/logging.md](docs/observability/logging.md)
32. [docs/uploads/file-uploads.md](docs/uploads/file-uploads.md)
33. [docs/deployment/deployment-rules.md](docs/deployment/deployment-rules.md)
34. [docs/git/git-rules.md](docs/git/git-rules.md)

### 8. Historial de decisiones
35. [docs/decision-log.md](docs/decision-log.md)

---

## Resolución de conflictos entre archivos

Si dos reglas contradicen, aplica en este orden:

1. Seguridad gana sobre diseño.
2. Performance gana sobre comodidad.
3. Stack oficial gana sobre sugerencias de la IA.
4. Mobile-first es obligatorio.
5. No se instalan dependencias nuevas sin autorización.
6. No se inventan endpoints, tablas, campos, roles ni reglas de negocio.

---

## Excepciones y aprendizajes del equipo

→ [Learning.md](Learning.md) — registro de excepciones a reglas STRICT/BLOCKER, decisiones técnicas puntuales y aprendizajes. Actualizar en cada commit que implique una desviación del blueprint.

---

## Ejemplo completo de arquitectura

→ [docs/conventions/full-stack-example.md](docs/conventions/full-stack-example.md) — cadena completa controller → service → repository con código real (Zod, Knex, Express, TypeScript).

---

## Algo no funciona

→ [docs/conventions/troubleshooting.md](docs/conventions/troubleshooting.md) — TypeScript, TanStack Query, formularios, soft delete, ESLint, paginación, Docker.

---

## Referencia rápida

Para devs con experiencia que necesitan una respuesta rápida (naming, status codes, error shape, paginación, stack):

→ [docs/conventions/quick-reference.md](docs/conventions/quick-reference.md)

---

## Templates y checklists disponibles

### Checklists (para humanos)
- [templates/checklists/new-feature-checklist.md](templates/checklists/new-feature-checklist.md) — antes de abrir un PR de feature
- [templates/checklists/code-review-checklist.md](templates/checklists/code-review-checklist.md) — al revisar un PR
- [templates/checklists/definition-of-done.md](templates/checklists/definition-of-done.md) — criterio de completitud de una tarea
- [docs/security/owasp-checklist.md](docs/security/owasp-checklist.md) — seguridad antes de dar por terminada una feature

### Prompts para IA (copiar y completar los campos `[...]`)
- [templates/prompts/create-new-endpoint.md](templates/prompts/create-new-endpoint.md) — crear un endpoint nuevo completo
- [templates/prompts/create-new-screen.md](templates/prompts/create-new-screen.md) — crear una pantalla nueva
- [templates/prompts/create-new-migration.md](templates/prompts/create-new-migration.md) — crear una migración de DB
- [templates/prompts/bug-fix.md](templates/prompts/bug-fix.md) — corregir un bug con diagnóstico + test de regresión
- [templates/prompts/refactor.md](templates/prompts/refactor.md) — refactorizar código sin cambiar comportamiento
- [templates/prompts/migrate-screen-to-design-system.md](templates/prompts/migrate-screen-to-design-system.md) — migrar pantalla al design system
