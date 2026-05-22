import { Router } from 'express';
import { IdeaController } from '@/controllers/idea.controller';
import { IdeaService } from '@/services/idea.service';
import { IdeaRepository } from '@/repositories/idea.repository';
import { validateBody } from '@/middleware/validate.middleware';
import { createIdeaSchema, updateIdeaSchema } from '@/schemas/idea.schema';

const router = Router();

// Inyección de dependencias manual (Regla 12)
const repository = new IdeaRepository();
const service = new IdeaService(repository);
const controller = new IdeaController(service);

// Definición de rutas con validación centralizada
router.get('/', controller.getAll);
router.post('/', validateBody(createIdeaSchema), controller.create);
router.put('/:id', validateBody(updateIdeaSchema), controller.update);
router.delete('/:id', controller.delete);

// Rutas de archivo
router.get('/archived', controller.getArchived);
router.post('/:id/restore', controller.restore);

export default router;
