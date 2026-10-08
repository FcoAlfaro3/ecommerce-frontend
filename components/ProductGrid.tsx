import Link from "next/link";
import { getProducts } from "@/lib/api";
import { ProductCard } from "./ProductCard";
import { Pagination } from "./Pagination";

// Server Component asíncrono: hace el fetch en el servidor y se muestra
// dentro de <Suspense>, así el resto de la página aparece de inmediato.
export async function ProductGrid({ search, page }: { search: string; page: number }) {
  const { data: products, meta } = await getProducts({ search, page, perPage: 12 });

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-surface p-10 text-center">
        <p className="font-semibold">
          {search ? `No hay productos que coincidan con “${search}”.` : "Todavía no hay productos en el catálogo."}
        </p>
        {search && (
          <Link href="/" className="mt-3 inline-block text-sm font-medium underline underline-offset-4">
            Ver todo el catálogo
          </Link>
        )}
      </div>
    );
  }

  const hrefFor = (n: number) => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (n > 1) params.set("page", String(n));
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  };

  return (
    <>
      <p className="mb-4 text-sm text-muted tabular-nums">
        {meta.total} {meta.total === 1 ? "producto" : "productos"}
        {search && <> para “{search}”</>}
      </p>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product, index) => (
          <li key={product.id} className="flex">
            <ProductCard product={product} eager={index < 4} />
          </li>
        ))}
      </ul>
      <Pagination page={meta.current_page} lastPage={meta.last_page} hrefFor={hrefFor} />
    </>
  );
}

export function ProductGridSkeleton() {
  return (
    <div aria-busy="true" aria-label="Cargando productos">
      <div className="skeleton mb-4 h-4 w-28" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-line bg-surface">
            <div className="skeleton aspect-square rounded-none" />
            <div className="space-y-3 p-4">
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-3 w-1/3" />
              <div className="skeleton h-7 w-20" />
              <div className="skeleton h-9 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
