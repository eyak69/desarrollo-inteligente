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

## Pruebas de Carga (Load Testing)

- **Herramienta:** [k6](https://k6.io/).
- **Estrategia:**
    1. **Smoke Test:** Validar estabilidad con carga mínima (5-10 VUs).
    2. **Load Test:** Validar comportamiento bajo carga esperada (50-100 VUs).
    3. **Stress Test:** Encontrar el punto de rotura del sistema.
- **Métricas Clave (KPIs):**
    - **P95 Latency:** < 500ms para endpoints críticos.
    - **Error Rate:** < 1% bajo carga normal.

## Reglas

- [STRICT] Si una operación puede traer más de 1000 registros, diseñarla como operación server-side.
- [STRICT] Todo nuevo endpoint crítico de negocio debe pasar un Smoke Test de k6 antes de promoverse a producción.
