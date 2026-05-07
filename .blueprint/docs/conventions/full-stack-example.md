# Ejemplo completo — Controller → Service → Repository

Ejemplo de referencia de la cadena completa para un endpoint `POST /api/ideas`.
Muestra cómo se conectan las capas sin mezclar responsabilidades.

---

## 1. Schema Zod (validación de entrada)

```typescript
// server/src/schemas/idea.schema.ts
import { z } from 'zod';

export const createIdeaSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(200),
  content: z.string().max(5000).optional(),
});

export type CreateIdeaDTO = z.infer<typeof createIdeaSchema>;
```

---

## 2. Repository (acceso a datos)

```typescript
// server/src/repositories/idea.repository.ts
import { Knex } from 'knex';
import { BaseRepository } from './base.repository';

export interface IdeaDB {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface IdeaDTO {
  id: string;
  userId: string;
  title: string;
  content: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class IdeaRepository extends BaseRepository<IdeaDB> {
  constructor(db: Knex) {
    super(db, 'ideas');
  }

  // Mapeo snake_case (DB) → camelCase (dominio) — ocurre AQUÍ, nunca en el controller
  toDTO(row: IdeaDB): IdeaDTO {
    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      content: row.content,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async findByUserId(userId: string): Promise<IdeaDTO[]> {
    const rows = await this.db('ideas')
      .where({ user_id: userId })
      .whereNull('deleted_at')
      .orderBy('created_at', 'desc');
    return rows.map(this.toDTO);
  }
}
```

---

## 3. Service (lógica de negocio)

```typescript
// server/src/services/idea.service.ts
import { IdeaRepository, IdeaDTO } from '../repositories/idea.repository';
import { CreateIdeaDTO } from '../schemas/idea.schema';
import { AppError } from '../errors/app-error';

export class IdeaService {
  constructor(private readonly ideaRepo: IdeaRepository) {}

  async create(userId: string, data: CreateIdeaDTO): Promise<IdeaDTO> {
    const row = await this.ideaRepo.create({
      user_id: userId,
      title: data.title,
      content: data.content ?? null,
    });
    return this.ideaRepo.toDTO(row);
  }

  async getByUser(userId: string): Promise<IdeaDTO[]> {
    return this.ideaRepo.findByUserId(userId);
  }

  async deleteOwn(userId: string, ideaId: string): Promise<void> {
    const idea = await this.ideaRepo.getById(ideaId);
    // Ownership check — va en el service porque requiere consulta a DB
    if (!idea || idea.user_id !== userId) {
      throw new AppError('NOT_FOUND', 404, 'Idea no encontrada');
    }
    await this.ideaRepo.delete(ideaId);
  }
}
```

---

## 4. Controller (recibe request, llama service, devuelve response)

```typescript
// server/src/controllers/idea.controller.ts
import { Request, Response, NextFunction } from 'express';
import { IdeaService } from '../services/idea.service';
import { createIdeaSchema } from '../schemas/idea.schema';

export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // La validación Zod ya corrió en el middleware de validación.
      // req.body está tipado y validado aquí.
      const body = createIdeaSchema.parse(req.body);
      const userId = req.user!.id; // seteado por el middleware de auth

      const idea = await this.ideaService.create(userId, body);
      res.status(201).json(idea);
    } catch (error) {
      next(error); // delega al middleware de errores central
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ideas = await this.ideaService.getByUser(req.user!.id);
      res.json(ideas);
    } catch (error) {
      next(error);
    }
  }
}
```

---

## 5. Route (registra endpoints y middlewares)

```typescript
// server/src/routes/idea.routes.ts
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { createIdeaSchema } from '../schemas/idea.schema';
import { IdeaController } from '../controllers/idea.controller';
import { IdeaRepository } from '../repositories/idea.repository';
import { IdeaService } from '../services/idea.service';
import { db } from '../config/database';

const router = Router();

// Inyección de dependencias — sin framework de DI
const ideaRepo = new IdeaRepository(db);
const ideaService = new IdeaService(ideaRepo);
const ideaController = new IdeaController(ideaService);

router.use(authMiddleware); // todas las rutas de ideas requieren auth

router.get('/', (req, res, next) => ideaController.list(req, res, next));
router.post('/', validateBody(createIdeaSchema), (req, res, next) =>
  ideaController.create(req, res, next),
);

export default router;
```

---

## 6. Middleware de validación (reutilizable)

```typescript
// server/src/middleware/validate.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../errors/app-error';

export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      // Mapea ZodError → AppError con shape estándar VALIDATION_FAILED
      return next(
        new AppError('VALIDATION_FAILED', 422, 'Datos inválidos', result.error.errors),
      );
    }
    req.body = result.data;
    next();
  };
}
```

---

## Flujo completo

```
POST /api/ideas
  → authMiddleware         (¿hay sesión válida? setea req.user)
  → validateBody(schema)   (¿body válido? mapea ZodError si falla)
  → IdeaController.create  (recibe req, llama service, devuelve 201)
  → IdeaService.create     (lógica de negocio, sin req/res)
  → IdeaRepository.create  (INSERT con Knex, devuelve IdeaDTO)
  ← res.status(201).json(idea)
```

---

## Principios aplicados

| Principio | Dónde se aplica |
|-----------|----------------|
| Validación con Zod | `validate.middleware.ts` — antes del controller |
| Auth en middleware | `auth.middleware.ts` — antes de cualquier lógica |
| Ownership en service | `IdeaService.deleteOwn` — requiere consulta a DB |
| Mapeo snake→camelCase | `IdeaRepository.toDTO` — en el repository |
| Controller sin lógica | `IdeaController` solo llama service y devuelve response |
| Service sin req/res | `IdeaService` no conoce Express |
| Errores centralizados | `next(error)` en controller → middleware de errores |
