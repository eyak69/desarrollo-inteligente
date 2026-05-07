import { z } from 'zod';

export const createIdeaSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(255),
  description: z.string().max(1000).nullable().optional(),
  complexity: z.enum(['easy', 'medium', 'hard']).default('medium'),
});

export const updateIdeaSchema = createIdeaSchema.partial();

export type CreateIdeaInput = z.infer<typeof createIdeaSchema>;
export type UpdateIdeaInput = z.infer<typeof updateIdeaSchema>;
