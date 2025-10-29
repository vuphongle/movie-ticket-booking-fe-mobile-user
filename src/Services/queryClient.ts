import { QueryClient } from "@tanstack/react-query";

/**
 * Query Client Configuration
 * Global settings for TanStack Query
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry failed requests
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Stale time - how long data is considered fresh
      staleTime: 1 * 60 * 1000, // 1 minute

      // Cache time (gcTime) - how long inactive data stays in cache
      gcTime: 5 * 60 * 1000, // 5 minutes

      // Refetch options
      refetchOnWindowFocus: false, // Don't refetch on window focus (mobile)
      refetchOnReconnect: true, // Refetch when network reconnects
      refetchOnMount: true, // Refetch when component mounts

      // Error handling
      throwOnError: false, // Don't throw errors globally
    },
    mutations: {
      // Retry failed mutations
      retry: 0, // Don't retry mutations by default

      // Error handling
      throwOnError: false,
    },
  },
});

/**
 * Clear all cached queries
 * Useful for logout scenarios
 */
export const clearQueryCache = () => {
  queryClient.clear();
};

/**
 * Invalidate profile-related queries
 * Useful after profile updates
 */
export const invalidateProfileQueries = () => {
  queryClient.invalidateQueries({
    queryKey: ["profile"],
  });
};
