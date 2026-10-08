import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { loadOwnOrder } from "@/lib/orders";
import { formatDate } from "@/lib/format";
import { OrderItems } from "@/components/OrderItems";

type Props = { params: Promise<{ orderId: string }> };

export const metadata: Metadata = { title: "Compra confirmada" };

export default async function ConfirmationPage({ params }: Props) {
  const { orderId } = await params;
  const order = await loadOwnOrder(orderId);

  // Solo las órdenes pagadas tienen confirmación.
  if (order.status !== "paid") redirect(`/checkout/${order.id}`);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-xl bg-ok-bg p-6">
        <svg aria-hidden width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-ok">
          <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" />
          <path d="m7 12.5 3.2 3L17 9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h1 className="mt-3 text-3xl font-bold">Compra confirmada</h1>
        <p className="mt-1">
          Recibimos tu pago de la orden #{order.id}. Puedes consultarla cuando quieras en Mis compras.
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-line bg-surface">
        <OrderItems order={order} />
      </div>

      {order.payment && (
        <dl className="mt-6 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
          <dt className="text-muted">Fecha de la orden</dt>
          <dd>{formatDate(order.created_at)}</dd>
          <dt className="text-muted">Referencia de Stripe</dt>
          <dd className="break-all font-mono text-xs leading-5">{order.payment.stripe_payment_intent_id}</dd>
        </dl>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/compras" className="btn btn-primary">Ver mis compras</Link>
        <Link href="/" className="btn btn-quiet">Seguir comprando</Link>
      </div>
    </div>
  );
}
