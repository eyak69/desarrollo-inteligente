# Paginación

## Estrategia por defecto

- [STRICT] **Offset/limit** para listados administrativos y grillas con AG Grid.
- [STRICT] **Cursor** para feeds, infinite scroll y datasets que cambian mucho.

## Request (offset)

```
GET /api/orders?page=1&pageSize=50&sortBy=createdAt&sortDir=desc&search=foo&status=paid
```

| Param      | Tipo   | Default | Notas                                 |
|------------|--------|---------|---------------------------------------|
| page       | int    | 1       | 1-based                               |
| pageSize   | int    | 25      | máx 100 (BLOCKER)                     |
| sortBy     | string | —       | columna whitelisted                   |
| sortDir    | enum   | asc     | `asc` \| `desc`                       |
| search     | string | —       | búsqueda libre en columnas indexadas  |
| filtros... | varios | —       | uno por columna filtrable             |

## Response (offset)

```json
{
  "data": [ { "id": "...", "..." } ],
  "page": 1,
  "pageSize": 50,
  "total": 1234,
  "totalPages": 25
}
```

## Request (cursor)

```
GET /api/feed?cursor=eyJpZCI6Li4ufQ&limit=20
```

## Response (cursor)

```json
{
  "data": [ { "id": "...", "..." } ],
  "nextCursor": "eyJpZCI6Li4ufQ" | null,
  "limit": 20
}
```

## Reglas

- [BLOCKER] `pageSize` y `limit` siempre topeados en backend (default 100).
- [BLOCKER] `sortBy` solo acepta columnas whitelisted (anti-injection y anti-leak).
- [STRICT] `total` es opcional en cursor (puede ser caro de calcular).
- [BLOCKER] No devolver más de lo pedido aunque haya más en memoria.
- [STRICT] El frontend nunca filtra/ordena datasets >1000 registros del lado cliente.

## AG Grid server-side

- El backend recibe los parámetros de AG Grid (`startRow`, `endRow`, `sortModel`,
  `filterModel`) y los traduce a los estándar de arriba en una capa de adapter.
- El controller no acepta `sortModel` directo: lo valida y mapea.
