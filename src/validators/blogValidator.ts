import { z } from 'zod';
import { getMaxRangeError, getMinRangeError } from '../lib';

const createSchema = z.object({
  coverImage: z.string().optional(),
  description: z.string().optional(),
  content: z.array(z.record(z.string(), z.unknown())),
  title: z.string().min(1, getMinRangeError('Title', 1)).max(255, getMaxRangeError('Title', 255)),
  slug: z.string().min(1, getMinRangeError('Slug', 1)).max(64, getMaxRangeError('Slug', 64)),
  category: z.string().min(1, getMinRangeError('Category', 1)).max(64, getMaxRangeError('Category', 64))
});

const updateSchema = z.object({
  coverImage: z.string().optional(),
  description: z.string().optional(),
  content: z.array(z.record(z.string(), z.unknown())).optional(),
  slug: z.string().min(1, getMinRangeError('Slug', 1)).max(64, getMaxRangeError('Slug', 64)).optional(),
  title: z.string().min(1, getMinRangeError('Title', 1)).max(255, getMaxRangeError('Title', 255)).optional(),
  category: z.string().min(1, getMinRangeError('Category', 1)).max(64, getMaxRangeError('Category', 64)).optional()
});

type updateSchema = z.infer<typeof updateSchema>;

export { createSchema, updateSchema };
