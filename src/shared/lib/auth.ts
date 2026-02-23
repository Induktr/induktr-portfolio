import { cookies } from "next/headers";
import crypto from "node:crypto";

const SESSION_SECRET = process.env.SESSION_SECRET || "default_secret_for_dev_32_chars_long!!";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "Induktr";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export interface Session {
  user?: {
    id: number;
    username: string;
  };
}

// Simple signing function
function sign(payload: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) return null;

  const [payloadBase64, signature] = sessionToken.split(".");
  if (!payloadBase64 || !signature) return null;

  const expectedSignature = sign(payloadBase64, SESSION_SECRET);
  if (signature !== expectedSignature) return null;

  try {
    const payload = JSON.parse(Buffer.from(payloadBase64, "base64").toString("utf-8"));
    const now = Date.now();
    
    if (payload.expiresAt < now) return null;

    return { user: payload.user };
  } catch (e) {
    return null;
  }
}

export async function login(username: string, password: string): Promise<boolean> {
  if (!ADMIN_PASSWORD) {
    console.error("❌ ADMIN_PASSWORD not set!");
    return false;
  }

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
    const payload = {
      user: { id: 1, username: ADMIN_USERNAME },
      expiresAt,
    };

    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64");
    const signature = sign(payloadBase64, SESSION_SECRET);
    const token = `${payloadBase64}.${signature}`;

    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
    });

    return true;
  }

  return false;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
