import { Router } from 'express';
import { IdeaController } from '@/controllers/idea.controller';

const router = Router();
const controller = new IdeaController();

router.get('/', controller.getAll);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
