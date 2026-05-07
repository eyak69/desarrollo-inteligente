# Convenciones de naming

## Code (TypeScript)

Todas las convenciones de esta tabla son `[STRICT]`. Desviarse requiere justificación explícita.

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

## Interfaces y tipos (TypeScript)

| Cosa | Convención | Ejemplo |
|------|-----------|---------|
| Shape de objeto de dominio (lo que maneja el service) | PascalCase sin prefijo | `User`, `Order`, `Idea` |
| Shape de fila de DB (lo que devuelve el repository) | PascalCase + sufijo `DB` | `UserDB`, `OrderDB` |
| Shape de request body de API | PascalCase + sufijo `DTO` | `CreateUserDTO`, `UpdateOrderDTO` |
| Shape de response de API | PascalCase + sufijo `DTO` | `UserDTO`, `OrderListDTO` |
| Props de componente React | PascalCase + sufijo `Props` | `UserCardProps`, `FormFieldProps` |
| Enum | PascalCase | `OrderStatus`, `UserRole` |
| Valores de enum | UPPER_SNAKE_CASE | `OrderStatus.PENDING`, `UserRole.ADMIN` |

- [STRICT] No usar prefijo `I` para interfaces (ej: `IUser`). Antipatrón en TypeScript moderno.
- [STRICT] No usar `type` y `interface` indistintamente: usar `interface` para shapes de objetos, `type` para unions, aliases e intersecciones.
- [GUIDE] Los tipos `DB` nunca deben salir del repositorio hacia el controller o el frontend. El repository transforma `UserDB → UserDTO` o `UserDB → User`.

## Branches y commits

Ver `docs/git/git-rules.md` para las reglas completas.

- [STRICT] Branches: `feature/<kebab-case>`, `fix/<kebab-case>`, `chore/<kebab-case>`.
- [BLOCKER] Commits: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`...). Sin commits con mensaje vacío o genérico ("fix", "cambios", "wip").
