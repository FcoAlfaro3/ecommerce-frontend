"use client";

import { ErrorPanel } from "@/components/ErrorPanel";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <ErrorPanel
      error={error}
      retry={retry}
      title="No se pudo cargar tu historial"
      hint="La API no respondió al consultar tus órdenes. Vuelve a intentarlo en unos segundos."
    />
  );
}
