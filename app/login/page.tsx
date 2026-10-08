import type { Metadata } from "next";
import { LoginForm } from "@/components/AuthForms";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; expirada?: string }>;
}) {
  const { next = "/", expirada } = await searchParams;
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-3xl font-bold">Iniciar sesión</h1>
      <p className="mb-6 mt-2 text-muted">
        {next.startsWith("/checkout")
          ? "Inicia sesión para terminar tu compra. Tu carrito sigue guardado."
          : "Entra para comprar y ver tu historial."}
      </p>
      {expirada && (
        <p className="mb-4 rounded-lg bg-warn-bg px-4 py-3 text-sm text-warn">
          Tu sesión venció. Vuelve a iniciar sesión para continuar.
        </p>
      )}
      <div className="rounded-xl border border-line bg-surface p-6">
        <LoginForm next={next} />
      </div>
    </div>
  );
}
