import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError, getProduct } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { ProductImage } from "@/components/ProductImage";
import { AddToCart } from "@/components/AddToCart";

type Props = { params: Promise<{ id: string }> };

async function loadProduct(id: string) {
  if (!/^\d+$/.test(id)) notFound();
  try {
    return await getProduct(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await loadProduct(id);
  return { title: product.name, description: product.description ?? undefined };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await loadProduct(id);

  return (
    <>
      <Link href="/" className="text-sm font-medium text-muted hover:underline underline-offset-4">
        Volver al catálogo
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-12">
        <ProductImage
          src={product.image_url}
          alt={product.name}
          eager
          sizes="(min-width: 768px) 50vw, 100vw"
          className="rounded-xl border border-line"
        />

        <div className="flex flex-col gap-5">
          <h1 className="text-3xl font-bold sm:text-4xl">{product.name}</h1>
          <span className="price-tag self-start text-3xl">{formatPrice(product.price)}</span>

          {product.description && (
            <p className="max-w-prose leading-relaxed text-pine/85">{product.description}</p>
          )}

          <p className={`text-sm font-medium ${product.stock === 0 ? "text-bad" : "text-muted"}`}>
            {product.stock === 0 ? "Sin unidades disponibles" : `${product.stock} unidades disponibles`}
          </p>

          {product.active ? (
            <AddToCart product={product} />
          ) : (
            <p className="font-semibold text-bad">Este producto ya no está a la venta.</p>
          )}
        </div>
      </div>
    </>
  );
}
