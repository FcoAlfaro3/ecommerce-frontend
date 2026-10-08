import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { ProductImage } from "./ProductImage";
import { QuickAdd } from "./AddToCart";

export function ProductCard({ product, eager }: { product: Product; eager?: boolean }) {
  const lowStock = product.stock > 0 && product.stock <= 5;
  return (
    <article className="flex w-full flex-col overflow-hidden rounded-xl border border-line bg-surface">
      <Link href={`/productos/${product.id}`} className="group block">
        <ProductImage
          src={product.image_url}
          alt={product.name}
          eager={eager}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="transition-opacity group-hover:opacity-90"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1">
          <h2 className="font-semibold leading-snug">
            <Link href={`/productos/${product.id}`} className="hover:underline underline-offset-4">
              {product.name}
            </Link>
          </h2>
          <p className={`mt-1 text-sm ${product.stock === 0 ? "text-bad" : lowStock ? "text-warn" : "text-muted"}`}>
            {product.stock === 0 ? "Agotado" : lowStock ? `Quedan ${product.stock}` : `${product.stock} disponibles`}
          </p>
        </div>
        <span className="price-tag self-start text-lg">{formatPrice(product.price)}</span>
        <QuickAdd product={product} />
      </div>
    </article>
  );
}
