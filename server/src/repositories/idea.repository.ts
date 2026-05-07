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

export class IdeaRepository extends BaseRepository<IdeaDB> {
  constructor() {
    super(db, 'ideas');
  }

  // Los métodos getAll, getById, create, update y delete 
  // ya están heredados de BaseRepository con soporte para Soft Delete.
  
  // Aquí se añadirían métodos específicos de esta entidad si fueran necesarios.
}
