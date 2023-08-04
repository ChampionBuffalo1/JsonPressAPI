import jwt from 'jsonwebtoken';
import type { ZodError } from 'zod';
import { JwtSecret } from '../Constants';
import { Response } from 'express';
import { ErrorCodes, GENERIC_ERROR } from './error';

function generateJwtToken(payload: Record<string, string>, expiresIn?: string): string {
  return jwt.sign(JSON.stringify(payload), JwtSecret, expiresIn ? { expiresIn } : {});
}

function getZodError(error: ZodError) {
  const errors = error.errors;
  const errorMessages: Record<string, string> = {};
  for (const err of errors) {
    errorMessages[err.path.join('.')] = err.message;
  }
  return errorMessages;
}

function getMinRangeError(field: string, min: number) {
  return `${field} must be greater than ${min}`;
}
function getMaxRangeError(field: string, max: number) {
  return `${field} must contain less than ${max} letter`;
}

function sendError(res: Response, code: keyof typeof ErrorCodes, status = 500, extra?: Record<string, string>) {
  const message = ErrorCodes[code] || GENERIC_ERROR;
  res.status(status).send({
    status: code,
    message: {
      ...extra,
      message
    }
  });
}

export { generateJwtToken, getZodError, getMinRangeError, getMaxRangeError, sendError };
