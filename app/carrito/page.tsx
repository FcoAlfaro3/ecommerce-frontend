import type { Metadata } from "next";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = { title: "Carrito" };

export default function CartPage() {
  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">Carrito</h1>
      <CartView />
    </>
  );
}
