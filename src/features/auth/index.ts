import crypto from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(crypto.scrypt);

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `${derivedKey.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashedPassword, salt] = stored.split(".");
  
  if (!hashedPassword || !salt) return false;
  
  const hashedSuppliedKey = (await scrypt(supplied, salt, 64)) as Buffer;
  return hashedSuppliedKey.toString("hex") === hashedPassword;
}

export { getSession, login, logout } from "@/shared/lib/auth";
export type { Session } from "@/shared/lib/auth";
