"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

export function CartLink() {
  const { count } = useCart();
  return (
    <Link
      href="/carrito"
      className="btn btn-quiet py-2"
      aria-label={count > 0 ? `Carrito, ${count} productos` : "Carrito vacío"}
    >
      <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L21 8H6.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9.5" cy="19.5" r="1.3" />
        <circle cx="17" cy="19.5" r="1.3" />
      </svg>
      Carrito
      {count > 0 && (
        <span className="min-w-6 rounded-full bg-tag px-1.5 text-center text-sm font-bold tabular-nums text-tag-ink">
          {count}
        </span>
      )}
    </Link>
  );
}
