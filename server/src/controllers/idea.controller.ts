import { Request, Response } from 'express';
import { IdeaService } from '@/services/idea.service';
import { createIdeaSchema, updateIdeaSchema } from '@/schemas/idea.schema';

export class IdeaController {
  constructor(private readonly service: IdeaService) {}

  getAll = async (req: Request, res: Response) => {
    try {
      const ideas = await this.service.listIdeas();
      res.json(ideas);
    } catch (error) {
      console.error('Error in IdeaController.getAll:', error);
      res.status(500).json({ error: 'Error al obtener las ideas' });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const validatedData = createIdeaSchema.parse(req.body);
      const newIdea = await this.service.createIdea(validatedData);
      res.status(201).json(newIdea);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(422).json({ error: 'Validación fallida', details: error.errors });
      }
      res.status(500).json({ error: 'Error al crear la idea' });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const validatedData = updateIdeaSchema.parse(req.body);
      await this.service.updateIdea(id, validatedData);
      res.status(204).send();
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(422).json({ error: 'Validación fallida', details: error.errors });
      }
      res.status(500).json({ error: 'Error al actualizar la idea' });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.service.deleteIdea(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la idea' });
    }
  };

  getArchived = async (req: Request, res: Response) => {
    try {
      const archived = await this.service.listArchivedIdeas();
      res.json(archived);
    } catch (error) {
      console.error('Error in IdeaController.getArchived:', error);
      res.status(500).json({ error: 'Error al obtener el archivo' });
    }
  };

  restore = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.service.restoreIdea(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error in IdeaController.restore:', error);
      res.status(500).json({ error: 'Error al restaurar la idea' });
    }
  };
}
