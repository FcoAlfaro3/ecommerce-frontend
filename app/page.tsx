import { Suspense } from "react";
import { ProductGrid, ProductGridSkeleton } from "@/components/ProductGrid";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page = "1" } = await searchParams;
  const search = q.trim();
  const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1);

  return (
    <>
      <section className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">Catálogo</h1>
          <p className="mt-2 max-w-prose text-muted">
            Precios en dólares. El stock se actualiza con cada compra.
          </p>
        </div>
        <form role="search" action="/" className="flex w-full gap-2 sm:w-auto">
          <label htmlFor="q" className="sr-only">Buscar productos</label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={search}
            placeholder="Buscar productos"
            className="field sm:w-72"
          />
          <button type="submit" className="btn btn-primary">Buscar</button>
        </form>
      </section>

      {/* La key reinicia el Suspense al cambiar de búsqueda o de página,
          para que se vea el skeleton mientras llegan los nuevos datos. */}
      <Suspense key={`${search}-${pageNumber}`} fallback={<ProductGridSkeleton />}>
        <ProductGrid search={search} page={pageNumber} />
      </Suspense>
    </>
  );
}
