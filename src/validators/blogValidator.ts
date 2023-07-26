import { z } from 'zod';

const createSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.array(z.record(z.string(), z.unknown())),
  slug: z.string().min(1).max(64),
  category: z.string().min(1).max(64)
});

export { createSchema };
