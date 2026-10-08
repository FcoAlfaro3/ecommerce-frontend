import { OrdersListSkeleton } from "@/components/OrdersList";

export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="skeleton h-9 w-48" />
      <div className="skeleton mb-6 mt-3 h-4 w-72" />
      <OrdersListSkeleton />
    </div>
  );
}
