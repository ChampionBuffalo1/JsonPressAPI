import jwt from 'jsonwebtoken';
import type { ZodError } from 'zod';
import { JwtSecret } from '../Constants';

function generateJwtToken(id: string, expiresIn?: string): string {
  const payload = { id };
  return jwt.sign(payload, JwtSecret, expiresIn ? { expiresIn } : {});
}

function getZodError(error: ZodError) {
  const errors = error.errors;
  const errorMessages: Record<string, string> = {};
  for (const err of errors) {
    errorMessages[err.path.join('.')] = err.message;
  }
  return errorMessages;
}

function getRangeError(field: string, min?: number, max?: number) {
  return `${field} must be greater than ${min} and less than ${max}`;
}

export { generateJwtToken, getZodError, getRangeError };
