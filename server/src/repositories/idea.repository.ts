import { BaseRepository } from './base.repository';
import db from '@/config/db';

export interface IdeaDB {
  id: string;
  title: string;
  description: string | null;
  complexity: 'easy' | 'medium' | 'hard';
  created_at: Date;
  deleted_at?: Date | null;
}

export interface IdeaDTO {
  id: string;
  title: string;
  description: string | null;
  complexity: string;
  createdAt: string;
}

export class IdeaRepository extends BaseRepository<IdeaDB> {
  constructor() {
    super(db, 'ideas');
  }

  /**
   * Mapeo snake_case (DB) -> camelCase (API)
   * Sigue la Regla 232 del Blueprint: El mapeo ocurre en el repositorio.
   */
  toDTO(row: IdeaDB): IdeaDTO {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      complexity: row.complexity,
      createdAt: row.created_at instanceof Date 
        ? row.created_at.toISOString() 
        : new Date(row.created_at).toISOString()
    };
  }

  /**
   * Sobrescribimos métodos para devolver DTOs si es necesario, 
   * o el Service se encarga de llamar a toDTO.
   */
}
