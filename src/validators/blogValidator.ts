import { z } from 'zod';
import { getRangeError } from '../lib';

const createSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(64, getRangeError('slug', 1, 64)),
  title: z
    .string()
    .min(1)
    .max(255, getRangeError('title', 1, 255)),
  category: z
    .string()
    .min(1)
    .max(64, getRangeError('slug', 1, 64)),
  coverImage: z.string().optional(),
  description: z.string().optional(),
  content: z.array(z.record(z.string(), z.unknown()))
});

const updateSchema = z.object({
  coverImage: z.string().optional(),
  description: z.string().optional(),
  slug: z
    .string()
    .min(1)
    .max(64, getRangeError('slug', 1, 64))
    .optional(),
  title: z
    .string()
    .min(1)
    .max(255, getRangeError('title', 1, 255))
    .optional(),
  category: z
    .string()
    .min(1)
    .max(64, getRangeError('category', 1, 64))
    .optional(),
  content: z.array(z.record(z.string(), z.unknown())).optional()
});

type updateSchema = z.infer<typeof updateSchema>;

export { createSchema, updateSchema };
