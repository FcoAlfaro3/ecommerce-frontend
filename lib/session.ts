import "server-only";
import { cookies } from "next/headers";
import type { User } from "./types";

// Nombres de las cookies. Ambas son httpOnly: el JavaScript del navegador
// no puede leerlas, así que el token no queda expuesto a ataques XSS.
export const TOKEN_COOKIE = "shop_token";
export const USER_COOKIE = "shop_user";

const SEVEN_DAYS = 60 * 60 * 24 * 7;

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SEVEN_DAYS,
};

export type SessionUser = Pick<User, "id" | "name" | "email">;

export async function getToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(TOKEN_COOKIE)?.value;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const raw = store.get(USER_COOKIE)?.value;
  if (!raw || !store.has(TOKEN_COOKIE)) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

// Solo se puede llamar desde Server Actions o Route Handlers.
export async function saveSession(token: string, user: User) {
  const store = await cookies();
  const publicUser: SessionUser = { id: user.id, name: user.name, email: user.email };
  store.set(TOKEN_COOKIE, token, sessionCookieOptions);
  store.set(USER_COOKIE, JSON.stringify(publicUser), sessionCookieOptions);
}
