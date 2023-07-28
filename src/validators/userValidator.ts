import { z } from 'zod';
import { getRangeError } from '../lib';

const passwordError = getRangeError('password', 8, 100);

const userCreate = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(3).max(100, 'Name must be greater than 3 and less than 100'),
  password: z.string().min(8).max(100, passwordError)
});

const userPassSchema = z.object({
  password: z.string().min(8).max(100, passwordError),
  oldpassword: z
    .string()
    .min(8)
    .max(100, getRangeError('oldpassword', 8, 100))
});

const userLogin = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100, passwordError)
});

const userSocialUpdate = z.object({
  type: z.enum(['twitter', 'instagram', 'facebook', 'website']),
  value: z.string().url('Invalid URL')
});

const userImageUpdate = z.object({
  image: z.string().min(4, {
    message: 'Invalid Image URL'
  })
});

export { userLogin, userCreate, userPassSchema, userSocialUpdate, userImageUpdate };
