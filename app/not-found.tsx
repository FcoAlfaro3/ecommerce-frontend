import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg py-10 text-center">
      <h1 className="text-3xl font-bold">Esta página no existe</h1>
      <p className="mt-2 text-muted">Puede que el producto ya no esté disponible o que el enlace tenga un error.</p>
      <Link href="/" className="btn btn-primary mt-6">Ir al catálogo</Link>
    </div>
  );
}
