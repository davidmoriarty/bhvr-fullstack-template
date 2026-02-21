// server/src/lib/auth/jwt.ts
import { env } from "../env";

export const JWT_SECRET = env.JWT_SECRET;

export type AccessTokenPayload = { userId: number };
