# Performance

## Frontend

- Lazy loading en rutas grandes.
- No renderizar listas enormes sin virtualización.
- Evitar re-render innecesario.
- Usar memoización solo donde haga falta.
- Imágenes optimizadas.
- **Estrategia de Caching:** Configurar `staleTime` y `gcTime` en TanStack Query para evitar peticiones redundantes. Datos de configuración deben tener cache largo, datos transaccionales cache corto.
- **Prefetching:** Implementar prefetching en rutas críticas (ej: pre-cargar datos de un detalle al hacer hover en la fila de la grilla).

## Backend

- Queries con paginación.
- Timeouts.
- Índices.
- Cache donde corresponda.
- Logs de queries lentas.

## Grillas

- Server-side.
- Filtros en backend.
- Orden en backend.
- Exportación pesada desde backend, no desde navegador.

## Regla

Si una operación puede traer más de 1000 registros, diseñarla como operación server-side.
