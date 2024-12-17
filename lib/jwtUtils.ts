import { SignJWT, jwtVerify } from 'jose';
import { JWTPayload } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

type JWT_PAYLOAD =
  | {
      username: string;
    }
  | JWTPayload;

export async function createToken(payload: JWT_PAYLOAD) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    throw new Error(`Invalid token: ${error}`);
  }
}

// initial objects setup like prisma client when starting the app
// to avoid creating new objects every time
