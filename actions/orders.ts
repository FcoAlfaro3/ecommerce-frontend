"use server";

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { ApiError, TAGS, confirmPaymentRequest, createOrderRequest } from "@/lib/api";
import type { FormState } from "@/lib/types";

// Métodos de pago de prueba de Stripe que acepta la API en confirm-payment.
const TEST_PAYMENT_METHODS = new Set(["pm_card_visa", "pm_card_mastercard", "pm_card_chargeDeclined"]);

function parseItems(raw: FormDataEntryValue | null) {
  try {
    const parsed = JSON.parse(String(raw ?? "[]"));
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => ({ product_id: Number(item.product_id), quantity: Number(item.quantity) }))
      .filter((item) => Number.isInteger(item.product_id) && Number.isInteger(item.quantity) && item.quantity > 0);
  } catch {
    return [];
  }
}

export async function createOrderAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const items = parseItems(formData.get("items"));
  if (items.length === 0) {
    return { message: "Tu carrito está vacío." };
  }

  let orderId: number;
  try {
    const { order } = await createOrderRequest(items);
    orderId = order.id;
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    // 422: stock insuficiente o datos inválidos. 502: la orden se creó pero
    // Stripe no respondió; igual cambió el stock, así que se revalida.
    if (error.status === 502) {
      revalidateTag(TAGS.products, { expire: 0 });
      revalidatePath("/compras");
    }
    const firstError = error.errors ? Object.values(error.errors)[0]?.[0] : undefined;
    return { message: firstError ?? error.message };
  }

  // La compra descontó stock: el catálogo cacheado queda desactualizado.
  // expire: 0 obliga a la siguiente visita a pedir datos frescos.
  revalidateTag(TAGS.products, { expire: 0 });
  revalidatePath("/compras");

  redirect(`/checkout/${orderId}?nueva=1`);
}

export async function payOrderAction(
  orderId: number,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const paymentMethod = String(formData.get("payment_method") ?? "");
  if (!TEST_PAYMENT_METHODS.has(paymentMethod)) {
    return { message: "Elige una tarjeta de prueba." };
  }

  try {
    const { order } = await confirmPaymentRequest(orderId, paymentMethod);
    revalidatePath("/compras");
    revalidatePath(`/checkout/${orderId}`);
    if (order.status !== "paid") {
      return { message: "Stripe todavía no confirma el pago. Vuelve a intentarlo en unos segundos." };
    }
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    // 402: tarjeta rechazada (la API marca la orden como fallida).
    // 422: la orden ya estaba procesada. En ambos casos la página debe
    // mostrar el estado real de la orden.
    revalidatePath("/compras");
    revalidatePath(`/checkout/${orderId}`);
    return { message: error.message };
  }

  redirect(`/checkout/${orderId}/confirmacion`);
}
