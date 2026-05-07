import db from '@/config/db';

export interface IdeaDB {
  id: string;
  title: string;
  description: string | null;
  complexity: 'easy' | 'medium' | 'hard';
  created_at: Date;
}

export class IdeaRepository {
  async getAll(): Promise<IdeaDB[]> {
    console.log('🔍 Repositorio: Iniciando consulta getAll...');
    try {
      const result = await db.raw('SELECT id, title, description, complexity, created_at FROM ideas ORDER BY created_at DESC');
      console.log('✅ Repositorio: Datos recibidos, filas:', result[0]?.length);
      return result[0];
    } catch (error) {
      console.error('❌ Repositorio: Error en consulta:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<IdeaDB | null> {
    const rows = await db.raw('SELECT * FROM ideas WHERE id = ?', [id]).then(res => res[0]);
    return rows[0] || null;
  }

  async create(data: Partial<IdeaDB>): Promise<string> {
    const id = crypto.randomUUID();
    await db.raw(
      'INSERT INTO ideas (id, title, description, complexity) VALUES (?, ?, ?, ?)',
      [id, data.title, data.description, data.complexity]
    );
    return id;
  }

  async update(id: string, data: Partial<IdeaDB>): Promise<void> {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    await db.raw(`UPDATE ideas SET ${fields}, updated_at = NOW() WHERE id = ?`, [...values, id]);
  }

  async delete(id: string): Promise<void> {
    await db.raw('DELETE FROM ideas WHERE id = ?', [id]);
  }
}
