import Link from "next/link";

interface Props {
  page: number;
  lastPage: number;
  /** Construye el href para un número de página. */
  hrefFor: (page: number) => string;
}

export function Pagination({ page, lastPage, hrefFor }: Props) {
  if (lastPage <= 1) return null;
  return (
    <nav aria-label="Paginación" className="mt-10 flex items-center justify-center gap-3 text-sm">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className="btn btn-quiet py-2">Anterior</Link>
      ) : (
        <span className="btn btn-quiet py-2 opacity-40" aria-disabled>Anterior</span>
      )}
      <span className="tabular-nums text-muted">
        Página {page} de {lastPage}
      </span>
      {page < lastPage ? (
        <Link href={hrefFor(page + 1)} className="btn btn-quiet py-2">Siguiente</Link>
      ) : (
        <span className="btn btn-quiet py-2 opacity-40" aria-disabled>Siguiente</span>
      )}
    </nav>
  );
}
