import { i18n } from "@Locales/i18n";

export function formatCurrency(value?: number): string {
  const amount = value ?? 0;
  const locale = i18n.language === "vi" ? "vi-VN" : "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}
