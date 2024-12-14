import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'default-secret-key';

interface JwtPayload {
  username: string;
}

export function createToken(
  payload: JwtPayload,
  expiresIn: string = '1h'
): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, SECRET_KEY) as JwtPayload;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}
