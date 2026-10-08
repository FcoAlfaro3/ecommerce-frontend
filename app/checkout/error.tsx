"use client";

import { ErrorPanel } from "@/components/ErrorPanel";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <ErrorPanel
      error={error}
      retry={retry}
      title="No se pudo cargar el pago"
      hint="La orden no se pudo consultar en la API. Tu carrito y tus órdenes no se perdieron; vuelve a intentarlo."
    />
  );
}
