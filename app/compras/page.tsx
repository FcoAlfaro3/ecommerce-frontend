import type { Metadata } from "next";
import { Suspense } from "react";
import { OrdersList, OrdersListSkeleton } from "@/components/OrdersList";

export const metadata: Metadata = { title: "Mis compras" };

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page = "1" } = await searchParams;
  const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold">Mis compras</h1>
      <p className="mb-6 mt-2 text-muted">Tus órdenes, de la más reciente a la más antigua.</p>
      <Suspense key={pageNumber} fallback={<OrdersListSkeleton />}>
        <OrdersList page={pageNumber} />
      </Suspense>
    </div>
  );
}
