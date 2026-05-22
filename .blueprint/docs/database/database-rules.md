# Reglas de base de datos

## Control de Cambios

- [BLOCKER] **Migraciones:** Uso obligatorio de Knex migrate. Prohibido hacer cambios manuales en tablas de producción. Todo cambio de esquema debe estar versionado en el código.
- [BLOCKER] **Rollbacks:** Cada migración debe tener su script `down` para revertir cambios en caso de fallo. Una migración sin `down` no se aprueba en PR.
- [STRICT] **Semilla de Datos (Seeds):** Mantener seeds para datos de configuración o catálogos obligatorios.
- [BLOCKER] **Implementación en Producción:** Todo nuevo campo, tabla o cambio estructural debe desplegarse mediante la ejecución automática de migraciones durante el flujo de despliegue. Una solución no se considera "implementada" hasta que el esquema de producción esté sincronizado al 100%.

## Convención de Nomenclatura

- [BLOCKER] **Nombre de Tablas:** Siempre en **plural**, minúsculas y usando `snake_case` (ej: `ideas`, `users`, `user_roles`). Evita colisiones de palabras reservadas SQL y da consistencia a las colecciones.
- [BLOCKER] **Campos de Tabla:** Siempre en `snake_case` y en minúsculas (ej: `first_name`, `created_at`).
- [BLOCKER] **Primary Keys (PK):** El identificador único de la tabla debe llamarse siempre `id` (UUID v4 para tablas de negocio).
- [BLOCKER] **Foreign Keys (FK):** Nombre de la tabla relacionada en **singular** seguido del sufijo `_id` (ej: `user_id`, `category_id`).
- [STRICT] **Campos Booleanos:** Deben comenzar con los prefijos `is_`, `has_` o `should_` (ej: `is_active`, `has_permission`).
- [STRICT] **Campos de Fecha:** Sufijados con `_at` para marcas de tiempo (timestamps con zona horaria) y `_date` para fechas puras sin hora (ej: `birth_date`).

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

## Automatización del Esquema (Single Source of Truth)

- [BLOCKER] **Diccionario de Datos Autogenerado:** Queda estrictamente prohibido editar manualmente el archivo `database-dictionary.md`. Este documento debe ser el reflejo exacto y fiel del esquema físico de la base de datos. En el flujo asistido por IA, la IA es responsable de ejecutar autónomamente el script de autogeneración (`node .blueprint/templates/scripts/generate-db-dictionary.js`) tras aplicar cualquier migración. Si el desarrollador humano realiza modificaciones manuales sin usar la IA, debe recordar ejecutar este comando antes de enviar un Pull Request.
- [BLOCKER] **Tipado TypeScript Dinámico y Automatizado:** Para evitar la deuda técnica de interfaces duplicadas y tipos obsoletos, se prohíbe declarar interfaces de TypeScript manuales para representar tablas de la base de datos. Se exige el uso de generadores automatizados (como `kanel` con `@kanel/knex` a través de `kanel.config.js`). La IA debe encargarse de la regeneración automática de los tipos del backend (`npx kanel`) durante la implementación de nuevas funcionalidades.

- [BLOCKER] **Gobernanza de Zonas Horarias:** Toda base de datos y aplicación debe configurarse para operar bajo un huso horario estándar e inmutable: **UTC (`Z`)**. Las marcas de tiempo (`created_at`, `updated_at`, `deleted_at`) deben almacenarse en formato UTC en el motor. La configuración de conexión del backend (Knex y Kanel) debe forzar explícitamente la conversión horaria a UTC para neutralizar diferencias locales de servidor y evitar desfases temporales de negocio.
- [BLOCKER] **Seguridad por Defecto (Zero Trust):** Los scripts de autogeneración y configuración de base de datos jamás deben contener credenciales hardcodeadas (usuarios, contraseñas, hosts). Toda conexión debe alimentarse exclusivamente de variables de entorno (.env) sanitizadas y protegidas de control de versiones.

