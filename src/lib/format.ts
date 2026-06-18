/** Shared formatting helpers for the dense, scannable BrandonOS tables. */

export function currency(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export function signedCurrency(value: number): string {
  const formatted = currency(Math.abs(value));
  return value < 0 ? `-${formatted}` : formatted;
}

export function percent(value: number): string {
  return `${Math.round(value)}%`;
}

export function shortDate(iso: string | null): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${m}/${d}/${y.slice(2)}`;
}
