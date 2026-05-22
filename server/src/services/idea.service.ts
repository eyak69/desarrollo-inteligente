import { IdeaRepository, IdeaDB, IdeaDTO } from '@/repositories/idea.repository';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class IdeaService {
  constructor(private readonly repository: IdeaRepository) {}

  async listIdeas(page: number = 1, limit: number = 10): Promise<PaginatedResult<IdeaDTO>> {
    const { data, total } = await this.repository.getPaged(page, limit);
    
    return {
      data: data.map(idea => this.repository.toDTO(idea)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async createIdea(data: Partial<IdeaDB>): Promise<IdeaDTO> {
    const id = await this.repository.create(data);
    const newIdea = await this.repository.getById(id);
    if (!newIdea) throw new Error('Error al crear la idea');
    
    return this.repository.toDTO(newIdea);
  }

  async updateIdea(id: string, data: Partial<IdeaDB>): Promise<void> {
    const exists = await this.repository.getById(id);
    if (!exists) throw new Error('Idea no encontrada');
    await this.repository.update(id, data);
  }

  async deleteIdea(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async listArchivedIdeas(): Promise<IdeaDTO[]> {
    const ideas = await this.repository.getArchived();
    return ideas.map(idea => this.repository.toDTO(idea));
  }

  async restoreIdea(id: string): Promise<void> {
    await this.repository.restore(id);
  }
}
