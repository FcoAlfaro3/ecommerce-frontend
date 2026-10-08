import { NextResponse, type NextRequest } from "next/server";

// Nombre de la cookie httpOnly con el token (ver lib/session.ts).
const TOKEN_COOKIE = "shop_token";

// Rutas que requieren sesión.
const PROTECTED = ["/checkout", "/compras"];
// Rutas que no tienen sentido si ya hay sesión.
const GUEST_ONLY = ["/login", "/registro"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasToken = request.cookies.has(TOKEN_COOKIE);

  if (!hasToken && PROTECTED.some((path) => pathname.startsWith(path))) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  if (hasToken && GUEST_ONLY.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/compras/:path*", "/login", "/registro"],
};
