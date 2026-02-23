import crypto from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(crypto.scrypt);

/**
 * Hashes a password using scrypt.
 * Useful for creating new admin credentials or when transitioning to DB-backed users.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `${derivedKey.toString("hex")}.${salt}`;
}

/**
 * Compares a supplied password with a stored scrypt hash.
 */
export async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashedPassword, salt] = stored.split(".");
  if (!hashedPassword || !salt) return false;
  
  const hashedSuppliedKey = (await scrypt(supplied, salt, 64)) as Buffer;
  return hashedSuppliedKey.toString("hex") === hashedPassword;
}

/**
 * Re-exports core auth functions from shared lib for feature-level access.
 * This maintains FSD structure by providing a clear entry point for auth-related logic.
 */
export { getSession, login, logout } from "@/shared/lib/auth";
export type { Session } from "@/shared/lib/auth";
