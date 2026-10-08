import Link from "next/link";
import { getSessionUser } from "@/lib/session";
import { CartLink } from "./CartLink";

export async function Header() {
  const user = await getSessionUser();

  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <span aria-hidden className="price-tag text-sm">$</span>
          Mostrador
        </Link>

        <nav aria-label="Principal" className="flex items-center gap-5 text-sm font-medium">
          <Link href="/" className="hover:underline underline-offset-4">Catálogo</Link>
          {user && <Link href="/compras" className="hover:underline underline-offset-4">Mis compras</Link>}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <CartLink />
          {user ? (
            <form action="/api/auth/logout" method="post" className="flex items-center gap-3">
              <span className="hidden text-sm text-muted sm:inline">Hola, {user.name.split(" ")[0]}</span>
              <button type="submit" className="text-sm font-medium hover:underline underline-offset-4">
                Cerrar sesión
              </button>
            </form>
          ) : (
            <Link href="/login" className="btn btn-primary py-2">Iniciar sesión</Link>
          )}
        </div>
      </div>
    </header>
  );
}
