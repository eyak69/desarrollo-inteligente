# Reglas de base de datos

## Control de Cambios

- **Migraciones:** Uso obligatorio de un sistema de migraciones (ej: `knex migrate`, `db-migrate`). Prohibido hacer cambios manuales en tablas de producción. Todo cambio de esquema debe estar versionado en el código.
- **Rollbacks:** Cada migración debe tener su script de `down` para revertir cambios en caso de fallo.
- **Semilla de Datos (Seeds):** Mantener seeds para datos de configuración o catálogos obligatorios.
- **Implementación en Producción:** Todo nuevo campo, tabla o cambio estructural debe ser desplegado en el servidor de producción mediante la ejecución automática de las migraciones durante el flujo de despliegue. Una solución no se considera "implementada" hasta que el esquema de producción esté sincronizado al 100%.

## Performance

- Índices para columnas de búsqueda.
- Índices para FK.
- Índices para filtros frecuentes.
- No usar SELECT * en APIs grandes.
- Paginación obligatoria.

## SQL

- Parametrizado siempre.
- Reportes complejos con SQL controlado.
- Evitar ORM para consultas críticas si genera SQL malo.

## Datasets grandes

- No mandar 50.000 registros al frontend.
- Backend devuelve páginas.
- Frontend pide filtros/orden/página.
- Usar total para paginación.

## Auditoría

Tablas críticas deberían tener:
- created_at
- updated_at
- created_by
- updated_by
- deleted_at si hay borrado lógico
