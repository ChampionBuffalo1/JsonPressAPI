import jwt from 'jsonwebtoken';
import type { ZodIssue } from 'zod';
import { JwtSecret } from '../Constants';

function generateJwtToken(id: string, expiresIn?: string): string {
  const payload = { id };
  return jwt.sign(payload, JwtSecret, expiresIn ? { expiresIn } : {});
}

function getZodError(issues: ZodIssue[]) {
  const errorMessages: Record<string, string> = {};
  for (const issue of issues) {
    if (issue.path) {
      errorMessages[issue.path.join('.')] = issue.message;
    }
  }
  return errorMessages;
}

export { generateJwtToken, getZodError };
