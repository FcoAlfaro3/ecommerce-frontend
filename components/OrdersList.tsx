import Link from "next/link";
import { getOrders } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { OrderItems } from "./OrderItems";
import { Pagination } from "./Pagination";
import { StatusBadge } from "./StatusBadge";

// Server Component pesado (consulta autenticada a la API): se envuelve en
// <Suspense> desde la página para no bloquear el encabezado.
export async function OrdersList({ page }: { page: number }) {
  const { data: orders, meta } = await getOrders(page);

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-surface p-10 text-center">
        <p className="font-semibold">Todavía no tienes compras.</p>
        <Link href="/" className="btn btn-primary mt-5">Ver el catálogo</Link>
      </div>
    );
  }

  return (
    <>
      <ol className="space-y-5">
        {orders.map((order) => (
          <li key={order.id} className="rounded-xl border border-line bg-surface">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
              <div>
                <h2 className="text-lg font-bold">Orden #{order.id}</h2>
                <p className="text-sm text-muted">{formatDate(order.created_at)}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={order.status} />
                {order.status === "pending" && (
                  <Link href={`/checkout/${order.id}`} className="btn btn-primary py-1.5 text-sm">
                    Completar pago
                  </Link>
                )}
              </div>
            </div>
            <OrderItems order={order} />
          </li>
        ))}
      </ol>
      <Pagination
        page={meta.current_page}
        lastPage={meta.last_page}
        hrefFor={(n) => (n > 1 ? `/compras?page=${n}` : "/compras")}
      />
    </>
  );
}

export function OrdersListSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Cargando tus compras">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="rounded-xl border border-line bg-surface">
          <div className="flex justify-between border-b border-line px-5 py-4">
            <div className="space-y-2">
              <div className="skeleton h-5 w-28" />
              <div className="skeleton h-3 w-40" />
            </div>
            <div className="skeleton h-6 w-24 rounded-full" />
          </div>
          <div className="space-y-3 px-5 py-4">
            <div className="skeleton h-4 w-2/3" />
            <div className="skeleton h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
