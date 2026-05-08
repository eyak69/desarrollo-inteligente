import { Knex } from 'knex';

/**
 * Repositorio Base Genérico
 * Implementa el estándar de persistencia del Blueprint Maestro:
 * - Inyección de dependencias (Knex)
 * - Soft Delete automático (deleted_at)
 * - Auditoría (created_at, updated_at)
 * - UUID v4 nativo
 */
export abstract class BaseRepository<T extends { id: string }> {
  constructor(
    protected readonly db: Knex,
    protected readonly tableName: string
  ) {}

  /**
   * Obtiene todos los registros no eliminados
   */
  async getAll(): Promise<T[]> {
    try {
      return await this.db<T>(this.tableName)
        .whereNull('deleted_at')
        .orderBy('created_at', 'desc');
    } catch (error) {
      // Regla 128: Registro detallado en logs antes de relanzar
      console.error(`❌ BaseRepository [${this.tableName}]: Error en getAll:`, error);
      throw error;
    }
  }

  /**
   * Obtiene un registro por ID si no está eliminado
   */
  async getById(id: string): Promise<T | null> {
    const row = await this.db<T>(this.tableName)
      .where({ id })
      .whereNull('deleted_at')
      .first();
    return (row as T) || null;
  }

  /**
   * Crea un nuevo registro con UUID automático
   */
  async create(data: Partial<T>): Promise<string> {
    const id = crypto.randomUUID();
    const payload = {
      ...data,
      id,
      created_at: this.db.fn.now(),
      updated_at: this.db.fn.now()
    };

    await this.db(this.tableName).insert(payload);
    return id;
  }

  /**
   * Actualización parcial de un registro
   */
  async update(id: string, data: Partial<T>): Promise<void> {
    await this.db(this.tableName)
      .where({ id })
      .whereNull('deleted_at')
      .update({
        ...data,
        updated_at: this.db.fn.now()
      });
  }

  /**
   * Borrado lógico (Soft Delete)
   */
  async delete(id: string): Promise<void> {
    await this.db(this.tableName)
      .where({ id })
      .update({ deleted_at: this.db.fn.now() });
  }

  /**
   * Obtiene solo los registros eliminados (Archivo)
   */
  async getArchived(): Promise<T[]> {
    return this.db<T>(this.tableName)
      .whereNotNull('deleted_at')
      .orderBy('deleted_at', 'desc');
  }

  /**
   * Restaura un registro eliminado lógicamente
   */
  async restore(id: string): Promise<void> {
    await this.db(this.tableName)
      .where({ id })
      .update({ 
        deleted_at: null,
        updated_at: this.db.fn.now()
      });
  }

  /**
   * Helper para extender consultas personalizadas
   */
  protected query() {
    return this.db<T>(this.tableName).whereNull('deleted_at');
  }
}
