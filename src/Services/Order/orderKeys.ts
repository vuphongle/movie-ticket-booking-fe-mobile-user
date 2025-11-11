/**
 * Query keys for order-related queries
 * Follows TanStack Query key factory pattern
 */
export const orderKeys = {
  all: ["order"] as const,
  history: () => [...orderKeys.all, "history"] as const,
  detail: (id: number) => [...orderKeys.all, "detail", id] as const,
  pdf: (id: number) => [...orderKeys.all, "pdf", id] as const,
} as const;
