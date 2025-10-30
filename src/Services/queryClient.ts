import { makeQueryClient } from "@Constants/Configs";

// Create query client using centralized config
export const queryClient = makeQueryClient();

/**
 * Clear all queries from cache
 */
export const clearQueryCache = () => {
  queryClient.clear();
};

/**
 * Invalidate specific queries
 */
export const invalidateQueries = (queryKey: string[]) => {
  queryClient.invalidateQueries({ queryKey });
};

/**
 * Reset specific queries
 */
export const resetQueries = (queryKey: string[]) => {
  queryClient.resetQueries({ queryKey });
};

/**
 * Remove specific queries from cache
 */
export const removeQueries = (queryKey: string[]) => {
  queryClient.removeQueries({ queryKey });
};