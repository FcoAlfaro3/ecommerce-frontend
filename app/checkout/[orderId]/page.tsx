import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { loadOwnOrder } from "@/lib/orders";
import { formatDate, formatPrice } from "@/lib/format";
import { ClearCart } from "@/components/ClearCart";
import { OrderItems } from "@/components/OrderItems";
import { PaymentForm } from "@/components/PaymentForm";
import { StatusBadge } from "@/components/StatusBadge";

type Props = {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ nueva?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orderId } = await params;
  return { title: `Pagar orden #${orderId}` };
}

export default async function PayOrderPage({ params, searchParams }: Props) {
  const [{ orderId }, { nueva }] = await Promise.all([params, searchParams]);
  const order = await loadOwnOrder(orderId);

  if (order.status === "paid") redirect(`/checkout/${order.id}/confirmacion`);

  return (
    <div className="mx-auto max-w-2xl">
      {nueva && <ClearCart />}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Orden #{order.id}</h1>
        <StatusBadge status={order.status} />
      </div>
      <p className="mb-6 mt-2 text-muted">Creada el {formatDate(order.created_at)}</p>

      <div className="mb-8 rounded-xl border border-line bg-surface">
        <OrderItems order={order} />
      </div>

      {order.status === "pending" && (
        <PaymentForm orderId={order.id} amount={formatPrice(order.total)} />
      )}

      {order.status === "failed" && (
        <div role="alert" className="rounded-xl bg-bad-bg p-6">
          <h2 className="text-lg font-bold text-bad">Stripe rechazó el pago</h2>
          <p className="mt-1">
            Esta orden quedó cerrada y no se hizo ningún cobro. Para comprar estos productos, agrégalos de nuevo al carrito.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/" className="btn btn-primary">Volver al catálogo</Link>
            <Link href="/compras" className="btn btn-quiet">Ver mis compras</Link>
          </div>
        </div>
      )}

      {order.status === "cancelled" && (
        <p className="rounded-xl bg-paper p-6 text-muted">Esta orden fue cancelada.</p>
      )}
    </div>
  );
}
