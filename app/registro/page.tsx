import type { Metadata } from "next";
import { RegisterForm } from "@/components/AuthForms";

export const metadata: Metadata = { title: "Crear cuenta" };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next = "/" } = await searchParams;
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-3xl font-bold">Crear cuenta</h1>
      <p className="mb-6 mt-2 text-muted">Con tu cuenta puedes comprar y revisar tus pedidos.</p>
      <div className="rounded-xl border border-line bg-surface p-6">
        <RegisterForm next={next} />
      </div>
    </div>
  );
}
