"use client";

import { useEffect } from "react";
import { cartActions } from "@/lib/cart";

// Vacía el carrito local una vez que la orden ya existe en la API.
export function ClearCart() {
  useEffect(() => {
    cartActions.clear();
  }, []);
  return null;
}
