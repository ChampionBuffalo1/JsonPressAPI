import { z } from 'zod';

const userCreate = z.object({
  email: z.string().email(),
  name: z.string().min(3).max(100),
  password: z.string().min(8).max(100)
});

const userPassSchema = z.object({
  password: z.string().min(8).max(100),
  oldpassword: z.string().min(8).max(100)
});

const userLogin = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100)
});

const userUpdateSchema = z.object({
  image: z.string().url().optional(),
  name: z.string().min(3).max(100).optional(),
  socialMedia: z
    .object({
      twitter: z.string().url().optional(),
      website: z.string().url().optional(),
      instagram: z.string().url().optional()
    })
    .optional()
});

export { userLogin, userCreate, userPassSchema, userUpdateSchema };
