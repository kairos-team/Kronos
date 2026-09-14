/**
 * Session token signing/verification, kept dependency-free from Node's `crypto`
 * module (uses Web Crypto instead) so this file can be imported from both
 * Server Actions/route handlers (Node runtime) and middleware (Edge runtime).
 */

export const SESSION_COOKIE = "kronos_session";
export const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "AUTH_SECRET não está definida. Configure essa variável de ambiente antes de fazer deploy."
    );
  }
  return "dev-only-insecure-secret-change-me";
}

function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBuf(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createSessionToken(userId: string): Promise<string> {
  const exp = Date.now() + SESSION_DURATION_MS;
  const payload = `${userId}.${exp}`;
  const key = await getKey();
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return `${payload}.${bufToHex(signature)}`;
}

export async function verifySessionToken(token: string): Promise<{ userId: string } | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [userId, expStr, sigHex] = parts;
  const exp = Number(expStr);
  if (!userId || !Number.isFinite(exp) || exp < Date.now()) return null;

  const key = await getKey();
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    hexToBuf(sigHex) as BufferSource,
    new TextEncoder().encode(`${userId}.${expStr}`)
  );
  return valid ? { userId } : null;
}
