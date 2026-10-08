import { NextResponse, type NextRequest } from "next/server";
import { TOKEN_COOKIE, USER_COOKIE } from "@/lib/session";

// Si la API responde 401 (token vencido o revocado) se llega aquí:
// se borran las cookies y se manda al usuario a iniciar sesión otra vez.
export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login?expirada=1", request.url));
  response.cookies.delete(TOKEN_COOKIE);
  response.cookies.delete(USER_COOKIE);
  return response;
}
