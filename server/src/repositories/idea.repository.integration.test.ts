import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { IdeaRepository } from './idea.repository';
import db from '@/config/db';

describe('IdeaRepository Integration (Soft Delete)', () => {
  const repository = new IdeaRepository();

  beforeAll(async () => {
    // Limpiar tabla antes de tests
    await db('ideas').truncate();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('debe crear una idea y luego listarla', async () => {
    const id = await repository.create({
      title: 'Idea de Prueba',
      description: 'Descripción',
      complexity: 'easy'
    });

    const ideas = await repository.getAll();
    expect(ideas.some(i => i.id === id)).toBe(true);
  });

  it('debe realizar un borrado lógico (soft delete)', async () => {
    // 1. Crear idea
    const id = await repository.create({
      title: 'Idea a borrar',
      description: 'Borrarme',
      complexity: 'medium'
    });

    // 2. Borrar (Soft)
    await repository.delete(id);

    // 3. Verificar que ya no aparece en getAll
    const ideas = await repository.getAll();
    expect(ideas.some(i => i.id === id)).toBe(false);

    // 4. Verificar que sigue existiendo en la DB físicamente
    const rawResult = await db.raw('SELECT * FROM ideas WHERE id = ?', [id]);
    const ideaEnDB = rawResult[0][0];
    
    expect(ideaEnDB).toBeDefined();
    expect(ideaEnDB.deleted_at).not.toBeNull();
  });

  it('getById no debe retornar una idea borrada lógicamente', async () => {
    const id = await repository.create({ title: 'Invisible', complexity: 'easy' });
    await repository.delete(id);

    const idea = await repository.getById(id);
    expect(idea).toBeNull();
  });
});
