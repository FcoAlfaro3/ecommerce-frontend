"use client";

import { useState } from "react";
import { cartActions, useCart } from "@/lib/cart";
import type { Product } from "@/lib/types";

type CartProduct = Pick<Product, "id" | "name" | "price" | "image_url" | "stock">;

function toCartItem(product: CartProduct) {
  const { id, name, price, image_url, stock } = product;
  return { id, name, price, image_url, stock };
}

/** Botón compacto para las tarjetas del catálogo. */
export function QuickAdd({ product }: { product: CartProduct }) {
  const { items } = useCart();
  const inCart = items.find((item) => item.id === product.id)?.quantity ?? 0;
  const soldOut = product.stock <= 0;
  const maxed = inCart >= product.stock;

  return (
    <button
      type="button"
      disabled={soldOut || maxed}
      onClick={() => cartActions.add(toCartItem(product))}
      className="btn btn-quiet w-full py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
    >
      {soldOut ? "Agotado" : inCart > 0 ? `En el carrito (${inCart})` : "Agregar al carrito"}
    </button>
  );
}

/** Selector de cantidad + botón, para la vista de detalle. */
export function AddToCart({ product }: { product: CartProduct }) {
  const { items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const inCart = items.find((item) => item.id === product.id)?.quantity ?? 0;
  const available = Math.max(0, product.stock - inCart);

  if (product.stock <= 0) {
    return <p className="font-semibold text-bad">Producto agotado por ahora.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm font-medium">
          Cantidad
          <select
            className="field mt-1 w-24"
            value={Math.min(quantity, Math.max(available, 1))}
            onChange={(event) => {
              setQuantity(Number(event.target.value));
              setAdded(false);
            }}
            disabled={available === 0}
          >
            {Array.from({ length: Math.min(Math.max(available, 1), 10) }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="btn btn-primary"
          disabled={available === 0}
          onClick={() => {
            cartActions.add(toCartItem(product), quantity);
            setQuantity(1);
            setAdded(true);
          }}
        >
          Agregar al carrito
        </button>
      </div>
      <p className="text-sm text-muted" aria-live="polite">
        {added
          ? `Listo. Tienes ${inCart} en el carrito.`
          : available === 0
            ? "Ya tienes en el carrito todas las unidades disponibles."
            : inCart > 0
              ? `Ya tienes ${inCart} en el carrito.`
              : null}
      </p>
    </div>
  );
}
