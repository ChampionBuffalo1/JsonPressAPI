import { z } from 'zod';

const createSchema = z.object({
  slug: z.string().min(1).max(64),
  title: z.string().min(1).max(255),
  category: z.string().min(1).max(64),
  coverImage: z.string().optional(),
  content: z.array(z.record(z.string(), z.unknown()))
});

const updateSchema = z.object({
  coverImage: z.string().optional(),
  slug: z.string().min(1).max(64).optional(),
  title: z.string().min(1).max(255).optional(),
  category: z.string().min(1).max(64).optional(),
  content: z.array(z.record(z.string(), z.unknown())).optional()
});

type updateSchema = z.infer<typeof updateSchema>;

export { createSchema, updateSchema };
