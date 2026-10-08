import { ProductGridSkeleton } from "@/components/ProductGrid";

// Se muestra al navegar hacia el catálogo mientras el servidor responde.
export default function Loading() {
  return (
    <>
      <div className="mb-8 space-y-3">
        <div className="skeleton h-9 w-48" />
        <div className="skeleton h-4 w-72" />
      </div>
      <ProductGridSkeleton />
    </>
  );
}
