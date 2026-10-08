"use client";

import { ErrorPanel } from "@/components/ErrorPanel";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <ErrorPanel
      error={error}
      retry={retry}
      title="No se pudo cargar el producto"
      hint="Hubo un problema al consultar la API. Vuelve a intentarlo en unos segundos."
    />
  );
}
