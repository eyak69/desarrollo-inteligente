# Reglas de Repositorios (Data Access Layer)

Esta capa es la única autorizada para interactuar con la base de datos. Su objetivo es aislar la lógica de persistencia del resto de la aplicación.

## Estándares de Implementación

- [BLOCKER] **Inyección de Dependencias:** Los repositorios deben recibir la instancia de la base de datos (o pool) a través de su constructor o mediante un módulo de configuración centralizado.
- [BLOCKER] **Uso de Knex Query Builder:** Es el estándar obligatorio. Prohibido el uso de `db.raw` salvo excepciones justificadas y documentadas en el decision log.
- [STRICT] **Tipado Estricto:** Cada método debe estar debidamente tipado usando interfaces que representen el esquema de la base de datos (ej: `IdeaDB`).

## Patrones de Métodos

### 1. Listado (`getAll`)
- [BLOCKER] Debe aplicar siempre el filtro `WHERE deleted_at IS NULL`.
- [STRICT] Debe soportar paginación y ordenamiento opcional.

### 2. Búsqueda por ID (`getById`)
- [BLOCKER] Debe verificar que el registro no esté borrado lógicamente.
- [STRICT] Debe retornar `null` si el registro no existe o está borrado.

### 3. Creación (`create`)
- [STRICT] Debe generar o validar el uso de UUIDs.
- [STRICT] Debe normalizar valores opcionales para evitar errores de *bindings* en la base de datos.

### 4. Actualización (`update`)
- [STRICT] Solo debe actualizar los campos proporcionados (Partial update).
- [STRICT] Debe actualizar automáticamente el campo `updated_at`.
- [BLOCKER] Debe verificar que el registro no esté borrado antes de intentar la actualización.

### 5. Borrado (`delete`)
- [BLOCKER] Por defecto, todos los borrados son **Lógicos (Soft Delete)**: `UPDATE` fijando `deleted_at = NOW()`.
- [BLOCKER] El borrado físico (`HARD DELETE`) está prohibido salvo tablas temporales o logs de sistema, y debe estar justificado en el decision log.

## Patrón de Repositorio Genérico (`BaseRepository`)

Para asegurar que todos los proyectos hereden la misma calidad y robustez, el Blueprint Maestro exige el uso del patrón **Generic Repository**.

### Ventajas del Patrón
- **Código DRY:** La lógica de Soft Delete, UUIDs y Auditoría (`created_at`, `updated_at`) se escribe una sola vez.
- **Consistencia:** Todos los servicios de la aplicación interactúan con los datos de la misma forma.
- **Mantenibilidad:** Si se decide cambiar la estrategia de borrado, solo se modifica un archivo.

### Cómo Implementar un Nuevo Repositorio
Para añadir una nueva entidad al sistema:
1. Definir la interfaz de la base de datos (ej: `ProyectoDB`).
2. Crear la clase que extienda de `BaseRepository<ProyectoDB>`.
3. Pasar el nombre de la tabla al constructor `super()`.

```typescript
export class ProyectoRepository extends BaseRepository<ProyectoDB> {
  constructor() {
    super('proyectos');
  }
}
```

## Implementación de referencia — `BaseRepository`

```typescript
// server/src/repositories/base.repository.ts
import { Knex } from 'knex';
import { randomUUID } from 'crypto';

export abstract class BaseRepository<TDB extends Record<string, unknown>> {
  constructor(
    protected readonly db: Knex,
    protected readonly tableName: string,
  ) {}

  async getAll(): Promise<TDB[]> {
    return this.db(this.tableName)
      .whereNull('deleted_at')
      .select('*');
  }

  async getById(id: string): Promise<TDB | null> {
    const row = await this.db(this.tableName)
      .where({ id })
      .whereNull('deleted_at')
      .first();
    return row ?? null;
  }

  async create(data: Omit<TDB, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): Promise<TDB> {
    const id = randomUUID();
    const now = new Date();
    const row = { ...data, id, created_at: now, updated_at: now };
    await this.db(this.tableName).insert(row);
    return this.getById(id) as Promise<TDB>;
  }

  async update(id: string, data: Partial<TDB>): Promise<TDB | null> {
    const exists = await this.getById(id);
    if (!exists) return null;
    await this.db(this.tableName)
      .where({ id })
      .whereNull('deleted_at')
      .update({ ...data, updated_at: new Date() });
    return this.getById(id);
  }

  async delete(id: string): Promise<boolean> {
    const affected = await this.db(this.tableName)
      .where({ id })
      .whereNull('deleted_at')
      .update({ deleted_at: new Date() });
    return affected > 0;
  }

  // Expone registros borrados — usar solo en contextos de auditoría
  async withDeleted(): Promise<TDB[]> {
    return this.db(this.tableName).select('*');
  }
}

// Ejemplo de repositorio concreto
// server/src/repositories/idea.repository.ts
export class IdeaRepository extends BaseRepository<IdeaDB> {
  constructor(db: Knex) {
    super(db, 'ideas');
  }
}
```

## Manejo de Errores

- [BLOCKER] Los repositorios no deben capturar excepciones silenciosamente.
- [STRICT] Deben registrar el error detallado en los logs del servidor (Pino) y relanzar la excepción para que el Servicio o Controlador decida la estrategia de respuesta.
- [BLOCKER] No se deben devolver mensajes de error técnicos de la base de datos al usuario final.
