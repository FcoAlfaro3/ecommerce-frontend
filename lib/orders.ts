import "server-only";
import { notFound } from "next/navigation";
import { ApiError, getOrder } from "./api";

// Carga una orden propia; si no existe o es de otro usuario (403/404) muestra 404.
export async function loadOwnOrder(id: string) {
  if (!/^\d+$/.test(id)) notFound();
  try {
    return await getOrder(id);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 403 || error.status === 404)) notFound();
    throw error;
  }
}
