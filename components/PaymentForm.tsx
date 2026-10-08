"use client";

import { useActionState } from "react";
import { payOrderAction } from "@/actions/orders";
import type { FormState } from "@/lib/types";

const TEST_CARDS = [
  { value: "pm_card_visa", label: "Visa terminada en 4242", note: "Pago aprobado" },
  { value: "pm_card_mastercard", label: "Mastercard terminada en 4444", note: "Pago aprobado" },
  { value: "pm_card_chargeDeclined", label: "Visa terminada en 0002", note: "Pago rechazado por el banco" },
];

export function PaymentForm({ orderId, amount }: { orderId: number; amount: string }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    payOrderAction.bind(null, orderId),
    {},
  );

  return (
    <form action={formAction} className="space-y-4">
      <fieldset className="space-y-2">
        <legend className="mb-2 font-semibold">Tarjeta de prueba de Stripe</legend>
        {TEST_CARDS.map((card, index) => (
          <label
            key={card.value}
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-line bg-surface px-4 py-3 has-[:checked]:border-pine has-[:checked]:bg-paper"
          >
            <input type="radio" name="payment_method" value={card.value} defaultChecked={index === 0} className="accent-pine" />
            <span className="flex-1">
              <span className="block font-medium">{card.label}</span>
              <span className="block text-sm text-muted">{card.note}</span>
            </span>
          </label>
        ))}
      </fieldset>

      {state.message && (
        <p role="alert" className="rounded-lg bg-bad-bg px-4 py-3 text-sm text-bad">{state.message}</p>
      )}

      <button type="submit" disabled={pending} className="btn btn-primary w-full text-base">
        {pending ? "Procesando el pago…" : `Pagar ${amount}`}
      </button>
      <p className="text-center text-xs text-muted">
        Modo de prueba: el cobro se confirma en Stripe desde el servidor y no se usa dinero real.
      </p>
    </form>
  );
}
