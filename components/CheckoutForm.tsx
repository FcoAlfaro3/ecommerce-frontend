"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createOrderAction } from "@/actions/orders";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import type { FormState } from "@/lib/types";

export function CheckoutForm() {
  const { items, total } = useCart();
  const [state, formAction, pending] = useActionState<FormState, FormData>(createOrderAction, {});

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-surface p-10 text-center">
        <p className="font-semibold">No hay productos para pagar.</p>
        <Link href="/" className="btn btn-primary mt-5">Ver el catálogo</Link>
      </div>
    );
  }

  const payload = JSON.stringify(items.map((item) => ({ product_id: item.id, quantity: item.quantity })));

  return (
    <form action={formAction} className="rounded-xl border border-line bg-surface">
      <input type="hidden" name="items" value={payload} />
      <ul className="divide-y divide-line">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between gap-4 px-5 py-3">
            <span>
              {item.name} <span className="text-muted tabular-nums">× {item.quantity}</span>
            </span>
            <span className="font-medium tabular-nums">{formatPrice(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between border-t border-line px-5 py-4 text-lg font-bold">
        <span>Total</span>
        <span className="tabular-nums">{formatPrice(total)}</span>
      </div>

      <div className="space-y-3 border-t border-line px-5 py-5">
        {state.message && (
          <p role="alert" className="rounded-lg bg-bad-bg px-4 py-3 text-sm text-bad">
            {state.message} <Link href="/carrito" className="font-semibold underline">Revisar carrito</Link>
          </p>
        )}
        <button type="submit" disabled={pending} className="btn btn-primary w-full">
          {pending ? "Creando la orden…" : "Crear orden y pasar al pago"}
        </button>
        <p className="text-center text-xs text-muted">
          Al crear la orden se reservan las unidades. El cobro se hace en el siguiente paso.
        </p>
      </div>
    </form>
  );
}
