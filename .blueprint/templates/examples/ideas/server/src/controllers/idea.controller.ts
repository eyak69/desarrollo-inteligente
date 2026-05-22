import { Request, Response, NextFunction } from 'express';
import { IdeaService } from '@/services/idea.service';


export class IdeaController {
  constructor(private readonly service: IdeaService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      
      const result = await this.service.listIdeas(page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // req.body ya viene validado por el middleware 'validate'
      const newIdea = await this.service.createIdea(req.body);
      res.status(201).json(newIdea);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.service.updateIdea(id, req.body);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.service.deleteIdea(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  getArchived = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const archived = await this.service.listArchivedIdeas();
      res.json(archived);
    } catch (error) {
      next(error);
    }
  };

  restore = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.service.restoreIdea(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
