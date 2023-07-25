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

const userSocialUpdate = z.object({
  type: z.enum(['twitter', 'instagram', 'website']),
  value: z.string().url()
});

export { userLogin, userCreate, userPassSchema, userSocialUpdate };
