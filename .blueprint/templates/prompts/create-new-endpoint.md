# Prompt para crear endpoint nuevo

Crear el endpoint: [METHOD] [PATH]

## Antes de codificar (obligatorio)

Leer:
- `/.blueprint/project-standards/architecture.md`
- `/.blueprint/docs/backend/backend-rules.md`
- `/.blueprint/docs/conventions/naming.md`
- `/.blueprint/docs/conventions/http-errors.md`
- `/.blueprint/docs/conventions/api-error-format.md`
- `/.blueprint/docs/conventions/pagination.md` (si es listado)
- `/.blueprint/docs/security/security-rules.md`

## Especificación

- Método y path:
- Auth requerida: (sí/no, qué rol)
- Recurso afectado:
- Request body / query / params:
- Response shape (caso 2xx):
- Códigos de error esperados:
- Reglas de validación (Zod):
- Reglas de negocio:
- Permisos / ownership a validar:
- Efectos colaterales (mails, jobs, audit log):

## Plan que la IA debe presentar antes de codificar

1. Archivos a crear o modificar (route, controller, service, repository, schema, tests).
2. Reutilización: qué service o repository existente reusa.
3. Riesgos (race conditions, transacciones, performance).
4. Tests que va a escribir (mínimo: happy path + 1 error + 1 permiso).

## Reglas no negociables

- [BLOCKER] SQL parametrizado.
- [BLOCKER] Validar input con Zod en el schema.
- [BLOCKER] Validar permisos en middleware o service, nunca confiar en frontend.
- [BLOCKER] Errores con shape estándar (ver `api-error-format.md`).
- [BLOCKER] No exponer stack ni nombres de tabla en errores.
- [STRICT] Listados usan paginación estándar.
- [STRICT] Logs incluyen `requestId` y `userId`.

## Al terminar

- Archivos modificados.
- Cómo probar (curl o request de ejemplo).
- Tests agregados.
- Pendientes / asunciones.
