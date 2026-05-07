# Checklist nueva feature

Marcar cada ítem antes de abrir el PR. Si no aplica, escribir "N/A" con un motivo.

## Stack y arquitectura
- [ ] Usa stack oficial — [project-standards/stack.md](../../project-standards/stack.md)
- [ ] Respeta capas: routes → controllers → services → repositories — [project-standards/architecture.md](../../project-standards/architecture.md)
- [ ] No instala dependencias nuevas sin autorización

## UI y diseño
- [ ] Usa componentes del design system (no inputs ni botones nativos sueltos) — [design-system/components.md](../../design-system/components.md)
- [ ] Es mobile-first, probado en 360px — [docs/mobile/mobile-rules.md](../mobile/mobile-rules.md)
- [ ] No hardcodea colores ni tamaños fuera del theme

## Estados obligatorios
- [ ] Loading state implementado (`isPending`)
- [ ] Empty state implementado (lista vacía, sin datos)
- [ ] Error state implementado (`ErrorState`, no pantalla en blanco)
- [ ] Success state implementado

## Formularios (si aplica)
- [ ] Usa React Hook Form + Zod — [docs/frontend/frontend-rules.md § Formularios](../frontend/frontend-rules.md)
- [ ] Errores de campo mostrados junto al campo, no solo al final
- [ ] Template de referencia: [templates/files/form-template.tsx](../files/form-template.tsx)

## Validación y seguridad
- [ ] Validación frontend con Zod para UX inmediata
- [ ] Validación backend con Zod en middleware — [BLOCKER] — [docs/backend/backend-rules.md](../backend/backend-rules.md)
- [ ] Permisos validados en backend — [BLOCKER]
- [ ] No expone secretos ni info técnica en responses — [docs/security/security-rules.md](../security/security-rules.md)

## Datos
- [ ] Listados con paginación server-side (nunca datasets sin límite) — [docs/conventions/pagination.md](../conventions/pagination.md)
- [ ] No carga >1000 registros en el frontend
- [ ] Soft delete aplicado si hay borrado — [docs/database/database-rules.md](../database/database-rules.md)
- [ ] Migración con `up` y `down` si hay cambios de esquema

## Naming y convenciones
- [ ] Naming correcto: camelCase código, snake_case DB, kebab-case URL — [docs/conventions/naming.md](../conventions/naming.md)
- [ ] Errores de API usan shape estándar — [docs/conventions/api-error-format.md](../conventions/api-error-format.md)
- [ ] HTTP status codes correctos — [docs/conventions/http-errors.md](../conventions/http-errors.md)

## Tests
- [ ] Happy path cubierto
- [ ] Al menos 1 caso de error cubierto
- [ ] Al menos 1 caso de permiso denegado cubierto
- [ ] Si fue bug fix: test de regresión incluido — [docs/testing/testing-rules.md](../testing/testing-rules.md)

## Operación
- [ ] Variables de entorno nuevas documentadas en `.env.example`
- [ ] Logs con `requestId`, sin secretos — [docs/observability/logging.md](../observability/logging.md)
- [ ] Accesibilidad mínima: labels, contraste, navegación por teclado — [docs/accessibility/a11y-rules.md](../accessibility/a11y-rules.md)
