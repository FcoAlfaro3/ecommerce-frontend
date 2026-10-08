"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, registerAction } from "@/actions/auth";
import type { FormState } from "@/lib/types";

function FieldError({ state, name }: { state: FormState; name: string }) {
  const message = state.errors?.[name]?.[0];
  if (!message) return null;
  return <p id={`${name}-error`} className="mt-1 text-sm text-bad">{message}</p>;
}

function Field({
  state,
  name,
  label,
  ...input
}: { state: FormState; name: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const invalid = !!state.errors?.[name];
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium">{label}</label>
      <input
        id={name}
        name={name}
        className="field"
        aria-invalid={invalid}
        aria-describedby={invalid ? `${name}-error` : undefined}
        defaultValue={state.values?.[name]}
        {...input}
      />
      <FieldError state={state} name={name} />
    </div>
  );
}

function FormMessage({ state }: { state: FormState }) {
  if (!state.message || state.errors) return null;
  return <p role="alert" className="rounded-lg bg-bad-bg px-4 py-3 text-sm text-bad">{state.message}</p>;
}

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(loginAction, {});
  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <FormMessage state={state} />
      <Field state={state} name="email" label="Correo electrónico" type="email" autoComplete="email" required />
      <Field state={state} name="password" label="Contraseña" type="password" autoComplete="current-password" required />
      <button type="submit" disabled={pending} className="btn btn-primary w-full">
        {pending ? "Iniciando sesión…" : "Iniciar sesión"}
      </button>
      <p className="text-center text-sm text-muted">
        ¿No tienes cuenta?{" "}
        <Link href={`/registro?next=${encodeURIComponent(next)}`} className="font-semibold text-pine underline underline-offset-4">
          Crear una cuenta
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(registerAction, {});
  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <FormMessage state={state} />
      <Field state={state} name="name" label="Nombre completo" autoComplete="name" required maxLength={255} />
      <Field state={state} name="email" label="Correo electrónico" type="email" autoComplete="email" required />
      <Field state={state} name="password" label="Contraseña (mínimo 8 caracteres)" type="password" autoComplete="new-password" minLength={8} required />
      <Field state={state} name="password_confirmation" label="Repite la contraseña" type="password" autoComplete="new-password" minLength={8} required />
      <button type="submit" disabled={pending} className="btn btn-primary w-full">
        {pending ? "Creando la cuenta…" : "Crear cuenta"}
      </button>
      <p className="text-center text-sm text-muted">
        ¿Ya tienes cuenta?{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-semibold text-pine underline underline-offset-4">
          Iniciar sesión
        </Link>
      </p>
    </form>
  );
}
