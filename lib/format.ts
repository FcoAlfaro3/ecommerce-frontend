const currency = new Intl.NumberFormat("es-SV", { style: "currency", currency: "USD" });
const dateTime = new Intl.DateTimeFormat("es-SV", { dateStyle: "medium", timeStyle: "short" });

export const formatPrice = (value: number) => currency.format(value);
export const formatDate = (iso: string) => dateTime.format(new Date(iso));
