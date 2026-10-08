import { NextResponse, type NextRequest } from "next/server";
import { logoutRequest } from "@/lib/api";
import { TOKEN_COOKIE, USER_COOKIE } from "@/lib/session";

// Route Handler de cierre de sesión: revoca el token en la API de Laravel
// (POST /api/logout) y elimina las cookies httpOnly.
export async function POST(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  if (token) await logoutRequest(token);

  const response = NextResponse.redirect(new URL("/", request.url), 303);
  response.cookies.delete(TOKEN_COOKIE);
  response.cookies.delete(USER_COOKIE);
  return response;
}
