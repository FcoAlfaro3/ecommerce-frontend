"use client";

import { ErrorPanel } from "@/components/ErrorPanel";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <ErrorPanel
      error={error}
      retry={retry}
      title="No se pudo cargar el catálogo"
      hint="La tienda no recibió respuesta de la API. Revisa que el servidor de Laravel esté encendido y vuelve a intentarlo."
    />
  );
}
