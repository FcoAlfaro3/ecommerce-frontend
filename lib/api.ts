import "server-only";
import { redirect } from "next/navigation";
import { getToken } from "./session";
import type { AuthResponse, Order, Paginated, Product } from "./types";

const API_BASE_URL = (process.env.API_BASE_URL ?? "http://127.0.0.1:8000/api").replace(/\/$/, "");

// Tags de caché. Se invalidan desde las Server Actions con revalidateTag().
export const TAGS = {
  products: "products",
  product: (id: number | string) => `product-${id}`,
} as const;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  /** Adjunta el token de la cookie httpOnly como Bearer. */
  auth?: boolean;
  next?: { revalidate?: number | false; tags?: string[] };
};

async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { body, auth = false, headers, ...init } = options;

  const token = auth ? await getToken() : undefined;
  if (auth && !token) redirect("/login");

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      0,
      "No se pudo conectar con la API. Verifica que el servidor de Laravel esté encendido.",
    );
  }

  // El token venció o fue revocado: se limpia la sesión y se pide login.
  if (auth && response.status === 401) {
    redirect("/api/auth/expirada");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.message ?? `La API respondió con el estado ${response.status}.`,
      data?.errors,
    );
  }

  return data as T;
}

/* ------------------------------------------------------------------ */
/* Lecturas (Server Components)                                        */
/* ------------------------------------------------------------------ */

// El catálogo es público: se cachea 60 s y se etiqueta con "products" para
// poder invalidarlo al instante cuando una compra cambia el stock.
export function getProducts(params: { search?: string; page?: number; perPage?: number }) {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  query.set("page", String(params.page ?? 1));
  query.set("per_page", String(params.perPage ?? 12));

  return apiFetch<Paginated<Product>>(`/products?${query}`, {
    next: { revalidate: 60, tags: [TAGS.products] },
  });
}

export async function getProduct(id: string) {
  const data = await apiFetch<{ product: Product }>(`/products/${id}`, {
    next: { revalidate: 60, tags: [TAGS.products, TAGS.product(id)] },
  });
  return data.product;
}

// Los datos del usuario nunca se cachean entre peticiones.
export function getOrders(page = 1) {
  return apiFetch<Paginated<Order>>(`/orders?page=${page}`, { auth: true, cache: "no-store" });
}

export async function getOrder(id: string) {
  const data = await apiFetch<{ order: Order }>(`/orders/${id}`, { auth: true, cache: "no-store" });
  return data.order;
}

/* ------------------------------------------------------------------ */
/* Mutaciones (solo se llaman desde Server Actions / Route Handlers)   */
/* ------------------------------------------------------------------ */

export function loginRequest(body: { email: string; password: string }) {
  return apiFetch<AuthResponse>("/login", { method: "POST", body, cache: "no-store" });
}

export function registerRequest(body: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}) {
  return apiFetch<AuthResponse>("/register", { method: "POST", body, cache: "no-store" });
}

export async function logoutRequest(token: string) {
  await fetch(`${API_BASE_URL}/logout`, {
    method: "POST",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    cache: "no-store",
  }).catch(() => null);
}

export function createOrderRequest(items: { product_id: number; quantity: number }[]) {
  return apiFetch<{ message: string; order: Order & { client_secret: string } }>("/orders", {
    method: "POST",
    auth: true,
    body: { items },
    cache: "no-store",
  });
}

export function confirmPaymentRequest(orderId: number, paymentMethod: string) {
  return apiFetch<{ message: string; order: Order }>(`/orders/${orderId}/confirm-payment`, {
    method: "POST",
    auth: true,
    body: { payment_method: paymentMethod },
    cache: "no-store",
  });
}
