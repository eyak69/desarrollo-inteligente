# Learning

Registro de decisiones técnicas, excepciones a reglas del blueprint, y
aprendizajes que deben propagarse al equipo. Actualizar en cada commit que
implique una excepción STRICT o un hallazgo relevante.

## Formato

```
## YYYY-MM-DD — [Proyecto o módulo] Título breve

**Regla afectada:** (archivo y regla del blueprint, si aplica)
**Excepción/Decisión:** qué se hizo diferente y por qué.
**Consecuencia:** qué pasa si se replica esto en otro lugar.
**¿Se debe actualizar el blueprint?** Sí/No. Si sí, quién lo hace.
```

---

<!-- Registrar aquí las entradas más recientes primero -->

## 2026-05-07 — [Ideas] Validación de permisos en service en lugar de middleware

**Regla afectada:** `docs/backend/backend-rules.md` § Seguridad — `[BLOCKER]` Auth en middleware.

**Excepción/Decisión:** El endpoint `PUT /api/ideas/:id` valida ownership (que la idea pertenece al usuario) dentro del service (`IdeaService.update`), no en middleware. El middleware solo valida autenticación (¿hay sesión?), pero la lógica "¿es dueño de esta idea?" requiere una consulta a DB que el middleware no puede hacer sin acoplar capas.

**Consecuencia:** Patrón válido para ownership checks que requieren consulta a DB. El middleware sigue siendo la capa de autenticación y autorización por rol. El service agrega la capa de ownership. Si se replica, documentarlo con un comentario en el service que diga explícitamente qué está validando.

**¿Se debe actualizar el blueprint?** Sí — agregar distinción entre "autorización por rol" (middleware) y "ownership" (service). Responsable: tech lead.

---

## 2026-05-07 — [Ideas] Paginación sin `total` en endpoint de búsqueda

**Regla afectada:** `docs/conventions/pagination.md` § Response (offset) — `[STRICT]` campo `total`.

**Excepción/Decisión:** El endpoint `GET /api/ideas?search=` no devuelve `total` ni `totalPages`. El `COUNT(*)` con full-text search sobre tablas grandes es costoso y la UI de búsqueda no muestra "página X de Y", solo resultados con scroll infinito.

**Consecuencia:** El frontend no puede renderizar un paginador con número de páginas para este endpoint. Si en el futuro se necesita el total, requiere una query separada o un índice adicional. Documentar en el contrato del endpoint que `total` es `null` intencionalmente.

**¿Se debe actualizar el blueprint?** No — pagination.md ya marca `total` como `[STRICT]` (requiere justificación para omitir). Esta entrada es la justificación.

---

## 2026-05-07 — [Ideas] `useEffect` para sincronizar título del documento

**Regla afectada:** `docs/frontend/frontend-rules.md` § Cuándo usar `useEffect` — `[STRICT]`.

**Excepción/Decisión:** Se usó `useEffect` para actualizar `document.title` al cambiar la idea seleccionada. Es uno de los casos legítimos del blueprint (sincronizar con sistema externo al ciclo de React: el DOM del browser).

**Consecuencia:** Patrón correcto, no es una excepción. Se registra porque confunde a devs que ven `useEffect` y asumen que está mal. El título del documento es un efecto secundario de UI, no un fetch de datos.

**¿Se debe actualizar el blueprint?** Sí — agregar `document.title` como ejemplo explícito de uso legítimo de `useEffect`. Responsable: quien haga la próxima revisión del blueprint.

---

## 2026-05-06 — [Ideas] Uso de `db.raw` para búsqueda full-text

**Regla afectada:** `docs/database/database-rules.md` § SQL Raw excepcional — `[STRICT]`

**Excepción/Decisión:** En el endpoint `GET /api/ideas?search=`, se usó `db.raw('MATCH(title, content) AGAINST(? IN BOOLEAN MODE)', [search])`. Knex no soporta `MATCH...AGAINST` nativamente y la alternativa con `LIKE %term%` no usa el índice FULLTEXT.

**Consecuencia:** El SQL raw está aislado en `idea.repository.ts` dentro del método `searchByText()`. Si se replica en otros repositorios, debe seguir el mismo patrón: método dedicado, comentado, y el término siempre como binding (nunca interpolado).

**¿Se debe actualizar el blueprint?** No — la excepción ya está contemplada en la regla. Este registro sirve como ejemplo de cuándo aplica.

---

## 2026-05-06 — [Ideas] `staleTime` en listado de ideas: 30 segundos

**Regla afectada:** `docs/frontend/frontend-rules.md` § Datos (TanStack Query) — `[STRICT]`

**Excepción/Decisión:** El hook `useIdeas()` usa `staleTime: 30_000`. Las ideas son datos transaccionales, pero `staleTime: 0` generaba demasiados refetches en navegación entre rutas. 30s es el balance elegido.

**Consecuencia:** Si se baja a 0, el UX mejora en tiempo real pero aumenta la carga al servidor. Si se sube a ≥5min, el listado puede estar desactualizado tras una creación. Revisar si aparece ese síntoma antes de cambiar.

**¿Se debe actualizar el blueprint?** No — el blueprint ya cubre este rango. Esta entrada es la referencia para futuros hooks similares.

---

## 2026-05-06 — [General] Migración en dos fases para agregar columna NOT NULL

**Regla afectada:** `docs/database/database-rules.md` § Control de Cambios — `[BLOCKER]`

**Excepción/Decisión:** Para agregar la columna `deleted_at` (NOT NULL con default) a la tabla `ideas` en producción sin downtime, se usó una migración en dos fases: (1) agregar columna nullable, (2) backfill de datos, (3) agregar constraint NOT NULL en una segunda migración. No se hizo en un solo `ALTER TABLE`.

**Consecuencia:** En tablas con muchas filas, un `ALTER TABLE` que agrega NOT NULL sin default reescribe toda la tabla y genera un lock largo. La estrategia de dos migraciones evita el lock. Seguir este patrón para cualquier cambio de schema en tablas grandes en producción.

**¿Se debe actualizar el blueprint?** Sí — agregar sección "Migraciones en producción sin downtime" en `database-rules.md`. Responsable: tech lead.

---

## 2026-05-22 — [Ideas] Auditoría de Discrepancias y Deuda Técnica de la App

**Regla afectada:** `.blueprint/project-standards/architecture.md` (Vertical Slice) y `.blueprint/docs/database/database-rules.md` (Normalización 3NF).

**Excepción/Decisión:** La aplicación de Ideas heredada continúa operando bajo una arquitectura por capas legacy (`/controllers`, `/services`, `/repositories`) y una base de datos desnormalizada (sin tablas para `users` o `categories`). Se decidió **no refactorizar inmediatamente** el código para conservar tokens de IA en esta etapa, pero se documentaron las discrepancias y las alternativas de mitigación (atómica incremental vs reestructuración física sin cambios de DB).

**Consecuencia:** El sistema mantiene una deuda técnica estructural latente. Todo nuevo desarrollo debe ser evaluado con cuidado para evitar que incremente el acoplamiento o consolide una base de datos plana no escalable.

**¿Se debe actualizar el blueprint?** No — el blueprint ya refleja el estado ideal (Vertical Slices y DB 3NF). Esta entrada documenta la justificación e identificación de la brecha existente en la app de Ideas.

---

## 2026-05-22 — [Seguridad] Auditoría Watchdog v2.3.0 y Dependencias

**Regla afectada:** `.blueprint/project-standards/architecture.md` (Docker & Resiliencia) y `.superpowers/blueprint-watchdog.md`.

**Excepción/Decisión:** Se realizó el escaneo de dependencias reales del monorepo y se detectó que Node.js 20 (base de los contenedores Docker) llegó a su fin de vida útil (EOL) el 30 de abril de 2026. Además, se identificó un conflicto de peer dependencies entre Vitest v4 y Vite v5 en el cliente, pero se decidió mantener la configuración actual porque los tests ejecutan sin errores y el lockfile ya resuelve versiones parchadas y seguras para los CVEs de Vite, AG Grid, path-to-regexp y body-parser.

**Consecuencia:** Se mantiene el uso de Node 20 en Docker y Vite v5 en el cliente temporalmente, lo que representa una deuda técnica y un riesgo de obsolescencia. Es imperativo planificar la migración a Node 22 (LTS) y Vite 6.x en el próximo ciclo de mantenimiento técnico.

**¿Se debe actualizar el blueprint?** Sí — se documentaron las discrepancias y mitigaciones en `.blueprint/docs/conventions/troubleshooting.md`.


