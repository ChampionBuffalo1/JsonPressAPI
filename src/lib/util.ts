import jwt from 'jsonwebtoken';
import { JwtSecret } from '../Constants';

function generateJwtToken(id: string, expiresIn?: string): string {
  const payload = { id };
  return jwt.sign(payload, JwtSecret, expiresIn ? { expiresIn } : {});
}

export { generateJwtToken };
