# Índice maestro del Blueprint

Este archivo es el punto de entrada obligatorio para Antigravity.

Antes de generar o modificar código, leer en este orden:

## Inicio rápido

0. `00-start-here/day-one.md`

## Operación e instrucciones de IA

1. `00-start-here/antigravity-master-prompt.md`
2. `ai-instructions/ai-operating-rules.md`
3. `ai-instructions/rule-severity.md`

## Estándares de proyecto

4. `project-standards/stack.md`
5. `project-standards/architecture.md`

## Design system

6. `design-system/design-principles.md`
7. `design-system/colors.md`
8. `design-system/typography.md`
9. `design-system/spacing.md`
10. `design-system/radius-elevation.md`
11. `design-system/components.md`
12. `design-system/layout.md`
13. `design-system/grid-rules.md`
14. `design-system/mobile-first.md`

## Seguridad (leer antes de tocar código)

15. `docs/security/security-rules.md`
16. `docs/security/owasp-checklist.md`

## Frontend / Backend / DB / Mobile

17. `docs/frontend/frontend-rules.md`
18. `docs/backend/backend-rules.md`
19. `docs/database/database-rules.md`
20. `docs/mobile/mobile-rules.md`
21. `docs/architecture/repository-rules.md`

## Convenciones transversales

21. `docs/conventions/naming.md`
22. `docs/conventions/http-errors.md`
23. `docs/conventions/api-error-format.md`
24. `docs/conventions/pagination.md`
25. `docs/conventions/dates-timezones.md`
26. `docs/conventions/money.md`
27. `docs/conventions/enforcement.md`
28. `docs/conventions/quick-reference.md`
29. `docs/conventions/troubleshooting.md`
30. `docs/conventions/full-stack-example.md`

## UI

22. `docs/ui/notification-rules.md`

## Calidad y plataforma

23. `docs/testing/testing-rules.md`
24. `docs/performance/performance-rules.md`
25. `docs/observability/logging.md`
26. `docs/accessibility/a11y-rules.md`
27. `docs/uploads/file-uploads.md`
28. `docs/deployment/deployment-rules.md`
29. `docs/git/git-rules.md`

## Templates y prompts

30. `templates/checklists/new-feature-checklist.md`
31. `templates/checklists/code-review-checklist.md`
32. `templates/checklists/definition-of-done.md`
33. `templates/prompts/create-new-endpoint.md`
34. `templates/prompts/create-new-screen.md`
35. `templates/prompts/create-new-migration.md`
36. `templates/prompts/bug-fix.md`
37. `templates/prompts/refactor.md`
38. `templates/prompts/migrate-screen-to-design-system.md`

## Historial

39. `docs/decision-log.md`

---

## Regla principal

Si hay conflicto entre archivos:

1. Seguridad gana sobre diseño.
2. Performance gana sobre comodidad.
3. Stack oficial gana sobre sugerencias de la IA.
4. Mobile-first es obligatorio.
5. No se instalan dependencias nuevas sin autorización.
6. No se inventan endpoints, tablas, campos, roles ni reglas de negocio.

## Objetivo

Construir aplicaciones replicables, seguras, modernas, consistentes y mantenibles.
