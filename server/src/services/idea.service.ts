import { IdeaRepository, IdeaDB } from '@/repositories/idea.repository';

export interface IdeaDTO {
  id: string;
  title: string;
  description: string | null;
  complexity: string;
  createdAt: string; // Mapeo a camelCase para el frontend
}

export class IdeaService {
  private repository: IdeaRepository;

  constructor() {
    this.repository = new IdeaRepository();
  }

  async listIdeas(): Promise<IdeaDTO[]> {
    const ideas = await this.repository.getAll();
    
    // Mapeo DB (snake_case) -> API (camelCase) (Regla 12)
    return ideas.map((idea: IdeaDB) => ({
      id: idea.id,
      title: idea.title,
      description: idea.description,
      complexity: idea.complexity,
      createdAt: idea.created_at instanceof Date ? idea.created_at.toISOString() : new Date().toISOString(),
    }));
  }

  async createIdea(data: any): Promise<IdeaDTO> {
    const id = await this.repository.create(data);
    const newIdea = await this.repository.getById(id);
    if (!newIdea) throw new Error('Error al crear la idea');
    
    return {
      id: newIdea.id,
      title: newIdea.title,
      description: newIdea.description,
      complexity: newIdea.complexity,
      createdAt: newIdea.created_at.toISOString(),
    };
  }

  async updateIdea(id: string, data: any): Promise<void> {
    const exists = await this.repository.getById(id);
    if (!exists) throw new Error('Idea no encontrada');
    await this.repository.update(id, data);
  }

  async deleteIdea(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
