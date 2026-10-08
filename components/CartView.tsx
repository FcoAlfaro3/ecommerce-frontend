"use client";

import Link from "next/link";
import { cartActions, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { ProductImageClient } from "./ProductImageClient";

export function CartView() {
  const { items, total, count } = useCart();

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-surface p-10 text-center">
        <p className="font-semibold">Tu carrito está vacío.</p>
        <p className="mt-1 text-sm text-muted">Agrega productos desde el catálogo para comprarlos.</p>
        <Link href="/" className="btn btn-primary mt-5">Ver el catálogo</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <ul className="divide-y divide-line rounded-xl border border-line bg-surface">
        {items.map((item) => (
          <li key={item.id} className="flex gap-4 p-4">
            <ProductImageClient src={item.image_url} alt={item.name} className="w-20 shrink-0 rounded-lg sm:w-24" />
            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Link href={`/productos/${item.id}`} className="font-semibold hover:underline underline-offset-4">
                  {item.name}
                </Link>
                <p className="text-sm text-muted tabular-nums">{formatPrice(item.price)} c/u</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-lg border border-line" role="group" aria-label={`Cantidad de ${item.name}`}>
                  <button
                    type="button"
                    className="h-9 w-9 text-lg disabled:opacity-40"
                    onClick={() => cartActions.setQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    aria-label="Quitar una unidad"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold tabular-nums" aria-live="polite">{item.quantity}</span>
                  <button
                    type="button"
                    className="h-9 w-9 text-lg disabled:opacity-40"
                    onClick={() => cartActions.setQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    aria-label="Agregar una unidad"
                  >
                    +
                  </button>
                </div>
                <span className="w-20 text-right font-semibold tabular-nums">{formatPrice(item.price * item.quantity)}</span>
                <button
                  type="button"
                  onClick={() => cartActions.remove(item.id)}
                  className="text-sm text-bad hover:underline underline-offset-4"
                >
                  Quitar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-xl border border-line bg-surface p-5">
        <h2 className="text-lg font-bold">Resumen</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Productos</dt>
            <dd className="tabular-nums">{count}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base font-bold">
            <dt>Total</dt>
            <dd className="tabular-nums">{formatPrice(total)}</dd>
          </div>
        </dl>
        <Link href="/checkout" className="btn btn-primary mt-5 w-full">Continuar al pago</Link>
        <button type="button" onClick={() => cartActions.clear()} className="mt-3 w-full text-sm text-muted hover:underline underline-offset-4">
          Vaciar carrito
        </button>
      </aside>
    </div>
  );
}
