// server/src/lib/auth/password.ts
const ARGON2ID = { algorithm: "argon2id" as const };

export async function hashSecret(secret: string): Promise<string> {
	return Bun.password.hash(secret, ARGON2ID);
}

export async function verifySecret(
	secret: string,
	hash: string,
): Promise<boolean> {
	return Bun.password.verify(secret, hash);
}

export const hashPassword = hashSecret;
export const verifyPassword = verifySecret;
export const hashRefreshToken = hashSecret;
