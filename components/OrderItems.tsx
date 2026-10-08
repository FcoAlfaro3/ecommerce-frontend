import { formatPrice } from "@/lib/format";
import type { Order } from "@/lib/types";

export function OrderItems({ order }: { order: Order }) {
  return (
    <>
      <ul className="divide-y divide-line">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between gap-4 px-5 py-3">
            <span>
              {item.product_name} <span className="text-muted tabular-nums">× {item.quantity}</span>
            </span>
            <span className="font-medium tabular-nums">{formatPrice(item.subtotal)}</span>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between border-t border-line px-5 py-4 text-lg font-bold">
        <span>Total</span>
        <span className="tabular-nums">{formatPrice(order.total)}</span>
      </div>
    </>
  );
}
