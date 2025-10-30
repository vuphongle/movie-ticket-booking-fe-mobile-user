/**
 * Query keys for user-related queries
 * Follows TanStack Query key factory pattern
 */
export const userKeys = {
  all: ["user"] as const,
  profile: () => [...userKeys.all, "profile"] as const,
} as const;
