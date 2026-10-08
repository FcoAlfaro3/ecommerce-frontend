// Tipos que reflejan exactamente los API Resources de Laravel
// (app/Http/Resources/*.php de la API de e-commerce).

export interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = "pending" | "paid" | "failed" | "cancelled";
export type PaymentStatus = "pending" | "succeeded" | "failed";

export interface OrderItem {
  id: number;
  product_id: number | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Payment {
  id: number;
  stripe_payment_intent_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  created_at: string;
}

export interface Order {
  id: number;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  payment: Payment | null;
  created_at: string;
}

// Respuesta de colecciones paginadas de Laravel (ResourceCollection + paginate).
export interface Paginated<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
  token_type: "Bearer";
}

// Estado que devuelven las Server Actions a los formularios.
export interface FormState {
  message?: string;
  errors?: Record<string, string[]>;
  /** Valores enviados, para no vaciar el formulario si hay un error. */
  values?: Record<string, string>;
}
