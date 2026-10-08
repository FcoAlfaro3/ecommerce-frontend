"use client";

import { useSyncExternalStore } from "react";

// Carrito como estado local del navegador. Se guarda en localStorage para
// que no se pierda al recargar, y se sincroniza entre pestañas.
// useSyncExternalStore evita errores de hidratación: en el servidor el
// carrito siempre está vacío y en el cliente se lee el valor real.

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
  stock: number;
  quantity: number;
}

const KEY = "shop_cart_v1";
const EMPTY: CartItem[] = [];

let items: CartItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    items = Array.isArray(parsed) ? parsed : EMPTY;
  } catch {
    items = EMPTY;
  }
}

function commit(next: CartItem[]) {
  items = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Almacenamiento lleno o bloqueado: el carrito sigue funcionando en memoria.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== KEY) return;
    loaded = false;
    load();
    listeners.forEach((l) => l());
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return items;
}

const clamp = (quantity: number, stock: number) => Math.max(1, Math.min(quantity, stock));

export const cartActions = {
  add(product: Omit<CartItem, "quantity">, quantity = 1) {
    load();
    const existing = items.find((item) => item.id === product.id);
    if (existing) {
      commit(
        items.map((item) =>
          item.id === product.id
            ? { ...item, ...product, quantity: clamp(item.quantity + quantity, product.stock) }
            : item,
        ),
      );
    } else {
      commit([...items, { ...product, quantity: clamp(quantity, product.stock) }]);
    }
  },
  setQuantity(id: number, quantity: number) {
    commit(items.map((item) => (item.id === id ? { ...item, quantity: clamp(quantity, item.stock) } : item)));
  },
  remove(id: number) {
    commit(items.filter((item) => item.id !== id));
  },
  clear() {
    commit(EMPTY);
  },
};

export function useCart() {
  const cart = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { items: cart, count, total };
}
