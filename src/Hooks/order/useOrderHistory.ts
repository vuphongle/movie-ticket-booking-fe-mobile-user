import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { orderService } from "@Services/Order";
import { orderKeys } from "@Services/Order";
import { handleApiError } from "@Utils";
import type { Order } from "@Types/orderTypes";

interface UseOrderHistoryOptions {
  onSuccess?: (orders: Order[]) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

/**
 * Hook to fetch order history for current user
 * Uses React Query for caching and automatic refetching
 */
export const useOrderHistory = (options?: UseOrderHistoryOptions) => {
  const query = useQuery({
    queryKey: orderKeys.history(),
    queryFn: async () => {
      try {
        const orders = await orderService.fetchOrderHistory();
        return orders;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 2,
  });

  // Handle success callback
  useEffect(() => {
    if (query.isSuccess && query.data && options?.onSuccess) {
      options.onSuccess(query.data);
    }
  }, [query.isSuccess, query.data]);

  // Handle error callback
  useEffect(() => {
    if (query.isError && query.error && options?.onError) {
      if (__DEV__) {
        console.log("🚨 Get order history error:", query.error.message);
      }
      options.onError(query.error);
    }
  }, [query.isError, query.error]);

  return query;
};
