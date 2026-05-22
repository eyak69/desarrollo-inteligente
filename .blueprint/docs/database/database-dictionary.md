# Diccionario de Datos (Plantilla - Single Source of Truth)

Este documento sirve como plantilla base y estándar para detallar las tablas del sistema, su propósito, campos y ciclo de vida en el nuevo proyecto, cumpliendo con la **Regla 20** de gobernanza.

---

## Entidades de Negocio (Ejemplo)

### 1. `users` (Nombre de la Tabla en Plural)
Describe brevemente qué almacena esta tabla (ej. Almacena las cuentas de usuario y credenciales del sistema).

| Columna | Tipo | Descripción | Ciclo de Vida / Reglas |
| :--- | :--- | :--- | :--- |
| `id` | UUID v4 | Identificador único universal. | Generado automáticamente en la creación. PK. |
| `email` | VARCHAR(255) | Correo electrónico de acceso. | Único, obligatorio. |
| `password_hash` | VARCHAR(255) | Contraseña encriptada (bcrypt/argon2). | Obligatorio. |
| `is_active` | BOOLEAN | Indica si el usuario está activo. | Por defecto `true`. Prefix `is_`. |
| `created_at` | TIMESTAMP | Marca de tiempo de la creación (UTC). | Automático por motor de DB. |
| `updated_at` | TIMESTAMP | Marca de tiempo de la última modificación. | Automático por motor de DB. |
| `deleted_at` | TIMESTAMP | Marca para borrado lógico (Soft Delete). | Nullable. Nulo por defecto. |

#### Motivo de creación:
Explicar el motivo de negocio de esta tabla y cómo se justifica (ej. Necesidad de identificar y autenticar a los usuarios del sistema).

---

## Entidades de Sistema

### 2. `knex_migrations`
Control de versiones del esquema de base de datos relacional.

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | INT | Identificador secuencial (PK). |
| `name` | VARCHAR(255) | Nombre del archivo físico de la migración. |
| `batch` | INT | Número de lote de ejecución para rollbacks. |
| `migration_time` | TIMESTAMP | Marca de tiempo de la ejecución. |

#### Motivo de creación:
Garantizar la reproducibilidad del entorno (Regla 14) y el control de cambios de esquema mediante migraciones.

---

## Flujo de Vida del Dato (Data Lifecycle Template)

Describir las transiciones de estado de los datos en las operaciones críticas:

1. **Creación (Ingesta):** El cliente envía la petición (ej. `POST /api/users`). El backend valida los inputs con Zod, encripta/sanitiza y persiste mediante Knex.
2. **Lectura (Consulta):** Consultas filtran automáticamente los registros borrados (`deleted_at IS NULL`). Los campos pasan por el transformador DTO `snake_case` -> `camelCase`.
3. **Actualización:** El controlador valida el cuerpo, actualiza los campos permitidos y el motor de la base de datos actualiza el campo `updated_at`.
4. **Borrado (Soft Delete):** El registro se marca con `deleted_at = NOW()`. Permanece en disco para mantener integridad referencial y auditoría, pero es invisible en consultas regulares de negocio.
