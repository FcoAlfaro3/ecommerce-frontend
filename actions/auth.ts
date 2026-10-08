"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ApiError, loginRequest, registerRequest } from "@/lib/api";
import { saveSession } from "@/lib/session";
import type { FormState } from "@/lib/types";

// Solo se permite redirigir a rutas internas (evita open redirects).
function safeNext(value: FormDataEntryValue | null) {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

function toFormState(error: unknown, fallback: string, values: Record<string, string>): FormState {
  if (error instanceof ApiError) {
    if (error.status === 401) return { message: "El correo o la contraseña no son correctos.", values };
    return { message: error.message || fallback, errors: error.errors, values };
  }
  throw error; // Errores inesperados (y redirect) siguen su curso normal.
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { message: "Escribe tu correo y tu contraseña.", values: { email } };
  }

  try {
    const { token, user } = await loginRequest({ email, password });
    // El token se guarda en una cookie httpOnly, nunca en localStorage.
    await saveSession(token, user);
  } catch (error) {
    return toFormState(error, "No se pudo iniciar sesión.", { email });
  }

  revalidatePath("/", "layout");
  redirect(safeNext(formData.get("next")));
}

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const body = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
    password_confirmation: String(formData.get("password_confirmation") ?? ""),
  };

  if (body.password !== body.password_confirmation) {
    return {
      errors: { password: ["Las contraseñas no coinciden."] },
      values: { name: body.name, email: body.email },
    };
  }

  try {
    const { token, user } = await registerRequest(body);
    await saveSession(token, user);
  } catch (error) {
    return toFormState(error, "No se pudo crear la cuenta.", { name: body.name, email: body.email });
  }

  revalidatePath("/", "layout");
  redirect(safeNext(formData.get("next")));
}
