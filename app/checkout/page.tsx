import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";
import { getSessionUser } from "@/lib/session";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const user = await getSessionUser();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold">Confirmar compra</h1>
      <p className="mb-6 mt-2 text-muted">
        Revisa tu pedido. La orden queda a nombre de {user?.email ?? "tu cuenta"}.
      </p>
      <CheckoutForm />
    </div>
  );
}
