import { z } from 'zod';
import { getMaxRangeError, getMinRangeError } from '../lib';

const minPass = getMinRangeError('Password', 8),
  maxPass = getMaxRangeError('Password', 100);

const createSchema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(3, getMinRangeError('Name', 3)).max(100, getMaxRangeError('Name', 100)),
  password: z.string().min(8, minPass).max(100, maxPass)
});

const passwordSchema = z.object({
  password: z.string().min(8, minPass).max(100, maxPass),
  oldpassword: z.string().min(8, getMinRangeError('Old Password', 8)).max(100, getMaxRangeError('Old Password', 100))
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, minPass).max(100, maxPass)
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

export { loginSchema, createSchema, passwordSchema, userSocialUpdate, userImageUpdate };
