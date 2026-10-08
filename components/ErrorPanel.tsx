"use client";

import Link from "next/link";
import { useEffect } from "react";

interface Props {
  error: Error & { digest?: string };
  retry: () => void;
  title: string;
  hint: string;
}

// Panel compartido por los archivos error.tsx de cada segmento.
export function ErrorPanel({ error, retry, title, hint }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="mx-auto max-w-lg rounded-xl border border-bad/30 bg-bad-bg p-8">
      <h1 className="text-2xl font-bold text-bad">{title}</h1>
      <p className="mt-2 text-pine">{hint}</p>
      {error.digest && <p className="mt-2 text-xs text-muted">Código de referencia: {error.digest}</p>}
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={() => retry()} className="btn btn-primary">
          Volver a intentar
        </button>
        <Link href="/" className="btn btn-quiet">Ir al catálogo</Link>
      </div>
    </div>
  );
}
