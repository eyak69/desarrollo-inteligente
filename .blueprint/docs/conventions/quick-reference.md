# Quick Reference — Reglas críticas de un vistazo

Para devs con experiencia en el proyecto. Las reglas completas están en cada archivo linked.

---

## Naming en 30 segundos

| Qué | Cómo | Ejemplo |
|-----|------|---------|
| Variable / función | camelCase | `getUserById` |
| Componente React | PascalCase | `UserCard` |
| Archivo componente | PascalCase.tsx | `UserCard.tsx` |
| Archivo no-componente | kebab-case.ts | `format-money.ts` |
| Interface de dominio | PascalCase | `User`, `Order` |
| Fila de DB | PascalCase + `DB` | `UserDB` |
| DTO de request/response | PascalCase + `DTO` | `CreateUserDTO` |
| Props de componente | PascalCase + `Props` | `UserCardProps` |
| Columna DB | snake_case | `created_at`, `user_id` |
| Tabla DB | snake_case plural | `users`, `order_items` |
| URL path | kebab-case | `/api/order-items` |
| Constante global | UPPER_SNAKE_CASE | `MAX_PAGE_SIZE` |

→ Detalle: [conventions/naming.md](naming.md)

---

## HTTP status codes en 30 segundos

| Situación | Status |
|-----------|--------|
| OK con datos | 200 |
| Creado | 201 |
| Sin contenido (DELETE ok) | 204 |
| Validación fallida | 422 |
| No autenticado | 401 |
| Sin permiso | 403 |
| No encontrado | 404 |
| Conflicto de estado | 409 |
| Error interno | 500 |

→ Detalle: [conventions/http-errors.md](http-errors.md)

---

## Error shape siempre

```json
{ "error": { "code": "VALIDATION_FAILED", "message": "...", "details": [], "requestId": "..." } }
```

→ Detalle: [conventions/api-error-format.md](api-error-format.md)

---

## Paginación en 30 segundos

```
GET /api/items?page=1&pageSize=50&sortBy=createdAt&sortDir=desc
```
- `page` es **1-based**. Offset = `(page - 1) * pageSize`.
- `pageSize` máx **100** — backend lo topea siempre.
- Response: `{ data, page, pageSize, total, totalPages }`

→ Detalle: [conventions/pagination.md](pagination.md)

---

## Stack permitido (no improvisar)

**Frontend:** React + TypeScript + Vite + MUI + AG Grid + TanStack Query + React Router + React Hook Form + Zod

**Backend:** Node.js + Express + TypeScript + Zod + Knex

**DB:** MySQL / MariaDB / Oracle — sin ORM

**Testing:** Vitest + React Testing Library + Playwright (E2E) + k6 (carga)

**Prohibido sin autorización:** Next.js, Redux, Zustand, Tailwind, Prisma, Sequelize, NestJS, Formik

→ Detalle: [project-standards/stack.md](../../project-standards/stack.md)

---

## Seguridad — los 6 BLOCKER más importantes

1. Auth siempre en middleware, permisos validados en backend.
2. Inputs validados con Zod antes de llegar al service.
3. SQL siempre parametrizado — nunca concatenar strings.
4. `message` de error nunca contiene SQL, paths ni nombres de tabla.
5. Secretos solo en GitHub Secrets / variables de entorno — nunca en el repo.
6. HTTPS obligatorio en todos los entornos públicos.

→ Detalle: [security/security-rules.md](../security/security-rules.md)

---

## Arquitectura de capas

```
Request → Middleware (auth, permisos, validación Zod)
        → Controller (recibe req, llama service, devuelve res)
        → Service (lógica de negocio, sin req/res)
        → Repository (SQL con Knex, mapeo DB→DTO)
        → DB
```

- Controllers no tienen lógica de negocio.
- Services no conocen `req` ni `res`.
- Repositories son la única capa que toca la DB.
- Transformación snake_case→camelCase ocurre en el repository.

→ Detalle: [project-standards/architecture.md](../../project-standards/architecture.md)

---

## Formularios (React Hook Form + Zod)

```tsx
const schema = z.object({ name: z.string().min(1) });
type FormValues = z.infer<typeof schema>;

const { register, handleSubmit, formState: { errors } } =
  useForm<FormValues>({ resolver: zodResolver(schema) });
```

→ Template completo: [templates/files/form-template.tsx](../../templates/files/form-template.tsx)

---

## staleTime por tipo de dato

| Tipo | Valor | Ejemplo |
|------|-------|---------|
| Configuración / catálogos | `Infinity` | roles, países, monedas |
| Datos de referencia | `300_000` (5 min) | usuarios, categorías |
| Datos transaccionales | `30_000` (30 seg) | listados, búsquedas |
| Datos en tiempo real | `0` | notificaciones, estado activo |

→ Detalle: [frontend/frontend-rules.md § Datos](../frontend/frontend-rules.md)

---

## Ejemplo end-to-end (controller → service → repository)

→ [conventions/full-stack-example.md](full-stack-example.md) — schema Zod, repository con mapeo, service con ownership, controller, route, middleware de validación.

---

## Reglas de severidad

| Marcador | Significado |
|----------|-------------|
| `[BLOCKER]` | Innegociable. Para cambiarla hay que editar el blueprint. |
| `[STRICT]` | Requiere justificación y aprobación humana explícita. |
| `[GUIDE]` | Puede desviarse con declaración. |
| Sin marcador | Se trata como `[STRICT]` por defecto. |

→ Detalle: [ai-instructions/rule-severity.md](../../ai-instructions/rule-severity.md)
