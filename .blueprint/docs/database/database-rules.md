# Reglas de base de datos

## Control de Cambios

- [BLOCKER] **Migraciones:** Uso obligatorio de Knex migrate. Prohibido hacer cambios manuales en tablas de producción. Todo cambio de esquema debe estar versionado en el código.
- [BLOCKER] **Rollbacks:** Cada migración debe tener su script `down` para revertir cambios en caso de fallo. Una migración sin `down` no se aprueba en PR.
- [STRICT] **Semilla de Datos (Seeds):** Mantener seeds para datos de configuración o catálogos obligatorios.
- [BLOCKER] **Implementación en Producción:** Todo nuevo campo, tabla o cambio estructural debe desplegarse mediante la ejecución automática de migraciones durante el flujo de despliegue. Una solución no se considera "implementada" hasta que el esquema de producción esté sincronizado al 100%.

## SQL y Acceso a Datos

- [BLOCKER] **Query Builder obligatorio:** Usar Knex para operaciones CRUD y consultas estándar. Motivo: prevención de SQL injection, manejo robusto de tipos TypeScript y normalización de `undefined/null`.
- [STRICT] **SQL Raw excepcional:** Solo se permite `db.raw` en consultas de reportes complejos o donde Knex genere un plan de ejecución ineficiente. Debe estar justificado con un comentario en el código y registrado en el decision log si es un patrón recurrente.
- [BLOCKER] **Parametrización:** Prohibido concatenar variables en strings SQL. Usar siempre bindings `?` o el sistema de interpolación segura de Knex.
- [STRICT] **Sin `SELECT *`:** Solicitar explícitamente las columnas necesarias para reducir ancho de banda y evitar filtrar datos sensibles accidentalmente.

## Estrategia de Soft Delete (Borrado Lógico)

- [BLOCKER] **Columna `deleted_at`:** Obligatoria en tablas de negocio. Tipo `timestamp` / `datetime`, nula por defecto.
- [STRICT] **Índices de filtrado:** Toda tabla con Soft Delete debe tener un índice en `deleted_at` para optimizar `WHERE deleted_at IS NULL` en listados masivos.
- [STRICT] **Gestión de unicidad:** Para columnas con restricción UNIQUE (ej: slugs, emails), usar índices compuestos que incluyan `deleted_at` o técnicas equivalentes para evitar colisiones con registros borrados.
- [BLOCKER] **Consultas de lectura:** El Repositorio debe filtrar automáticamente los registros borrados en todos sus métodos. Solo se exponen registros borrados a través de métodos explícitos como `withDeleted()`.

## Auditoría y Trazabilidad

Toda tabla crítica de negocio DEBE incluir:

- [BLOCKER] `id`: UUID v4. Prohibido usar enteros secuenciales auto-increment en tablas de negocio expuestas por API (evita enumeración de recursos).
- [BLOCKER] `created_at`: Generado automáticamente por el motor de DB.
- [BLOCKER] `updated_at`: Actualizado automáticamente en cada modificación.
- [BLOCKER] `deleted_at`: Para borrado lógico. Nullable.
- [GUIDE] `version`: Para control de concurrencia optimista en sistemas de alta concurrencia.

## Performance e Índices

- [BLOCKER] **Paginación obligatoria:** Todos los endpoints de listado deben paginar. El backend nunca devuelve datasets sin límite. Ver `docs/conventions/pagination.md`.
- [STRICT] **Índices en columnas de búsqueda:** Obligatorios para Foreign Keys, columnas de filtro frecuente y columnas en cláusulas `ORDER BY` de alto volumen.
- [GUIDE] Revisar el plan de ejecución (`EXPLAIN`) en queries sobre tablas con más de 10.000 registros antes de hacer deploy.
