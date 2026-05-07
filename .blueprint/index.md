# Índice maestro del Blueprint

Este archivo es el punto de entrada obligatorio para Antigravity.

Antes de generar o modificar código, leer en este orden:

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

## Convenciones transversales

21. `docs/conventions/naming.md`
22. `docs/conventions/http-errors.md`
23. `docs/conventions/api-error-format.md`
24. `docs/conventions/pagination.md`
25. `docs/conventions/dates-timezones.md`
26. `docs/conventions/money.md`

## Calidad y plataforma

27. `docs/testing/testing-rules.md`
28. `docs/performance/performance-rules.md`
29. `docs/observability/logging.md`
30. `docs/accessibility/a11y-rules.md`
31. `docs/uploads/file-uploads.md`
32. `docs/deployment/deployment-rules.md`
33. `docs/git/git-rules.md`

## Historial

34. `docs/decision-log.md`

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
