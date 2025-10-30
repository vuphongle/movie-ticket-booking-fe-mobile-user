/**
 * Query keys for auth-related queries
 * Follows TanStack Query key factory pattern
 */
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
} as const;
