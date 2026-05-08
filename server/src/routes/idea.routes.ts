import { Router } from 'express';
import { IdeaController } from '@/controllers/idea.controller';
import { IdeaService } from '@/services/idea.service';
import { IdeaRepository } from '@/repositories/idea.repository';
import db from '@/config/db';

const router = Router();

// Inyección de Dependencias Manual (Regla 12)
const repository = new IdeaRepository(db);
const service = new IdeaService(repository);
const controller = new IdeaController(service);

router.get('/', controller.getAll);
router.get('/archived', controller.getArchived);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);
router.post('/:id/restore', controller.restore);

export default router;
