import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { WebVitals } from "@/components/WebVitals";

export const metadata: Metadata = {
  title: { default: "Mostrador | Tienda en línea", template: "%s | Mostrador" },
  description: "Catálogo y compras en línea con pago seguro mediante Stripe.",
};

export const viewport: Viewport = {
  themeColor: "#173b33",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-dvh">
        <WebVitals />
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
      </body>
    </html>
  );
}
