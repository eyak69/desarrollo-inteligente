# Convenciones de naming

## Code (TypeScript)

| Cosa                       | Caso             | Ejemplo                       |
|----------------------------|------------------|-------------------------------|
| Variables, funciones       | camelCase        | `getUserById`                 |
| Componentes React          | PascalCase       | `UserList`, `OrderDetail`     |
| Tipos, interfaces, enums   | PascalCase       | `User`, `OrderStatus`         |
| Hooks                      | camelCase + `use`| `useCurrentUser`              |
| Constantes globales        | UPPER_SNAKE_CASE | `MAX_PAGE_SIZE`               |
| Archivos de componentes    | PascalCase.tsx   | `UserList.tsx`                |
| Archivos no-componente     | kebab-case.ts    | `format-money.ts`             |
| Carpetas                   | kebab-case       | `order-detail/`               |

- [STRICT] Un archivo `.tsx` con un componente principal exporta ese componente
  como default y se llama igual.
- [STRICT] Helpers de un feature van en el mismo feature, no en `/utils` global,
  salvo que sean reutilizables en serio.

## URLs / API

- [STRICT] Recursos en plural: `/api/users`, `/api/orders`.
- [STRICT] kebab-case en path: `/api/order-items`, no `/api/orderItems`.
- [STRICT] Querystring en camelCase: `?pageSize=50&sortBy=createdAt`.
- [STRICT] Parámetros de path en camelCase también: `/api/users/:userId`.
- [BLOCKER] No exponer IDs internos sensibles (rotar a UUID si hace falta).

## Base de datos

- [STRICT] Tablas en `snake_case` plural: `users`, `order_items`.
- [STRICT] Columnas en `snake_case`: `created_at`, `user_id`.
- [STRICT] Foreign keys: `<tabla_singular>_id` (`user_id`, `order_id`).
- [STRICT] Booleanos: `is_*` o `has_*` (`is_active`, `has_paid`).
- [STRICT] Timestamps obligatorios en tablas críticas:
  `created_at`, `updated_at`, `created_by`, `updated_by`.
- [STRICT] Soft delete: `deleted_at` nullable.

## Mapeo DB ↔ API

- [BLOCKER] El mapeo DB (snake_case) → API (camelCase) ocurre en el
  repository/service, no en el controller ni en el frontend.
- [STRICT] El frontend siempre habla camelCase.

## Branches y commits

Ver `docs/git/git-rules.md`.

- Branches: `feature/<kebab-case>`, `fix/<kebab-case>`, `chore/<kebab-case>`.
- Commits: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`...).
