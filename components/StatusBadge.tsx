import type { OrderStatus } from "@/lib/types";

const STYLES: Record<OrderStatus, { label: string; className: string }> = {
  paid: { label: "Pagada", className: "bg-ok-bg text-ok" },
  pending: { label: "Pago pendiente", className: "bg-warn-bg text-warn" },
  failed: { label: "Pago rechazado", className: "bg-bad-bg text-bad" },
  cancelled: { label: "Cancelada", className: "bg-[#e9ecea] text-muted" },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const style = STYLES[status] ?? STYLES.pending;
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-sm font-semibold ${style.className}`}>
      {style.label}
    </span>
  );
}
