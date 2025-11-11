import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { orderService } from "@Services/Order";
import { orderKeys } from "@Services/Order";
import { handleApiError } from "@Utils";
import type { Order } from "@Types/orderTypes";

interface UseOrderDetailsOptions {
  onSuccess?: (order: Order) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

/**
 * Hook to fetch order details by ID
 * Uses React Query for caching and automatic refetching
 */
export const useOrderDetails = (orderId: number, options?: UseOrderDetailsOptions) => {
  const query = useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: async () => {
      try {
        const order = await orderService.fetchOrderById(orderId);
        return order;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    enabled: (options?.enabled ?? true) && !!orderId,
    staleTime: 10 * 60 * 1000, // Consider data fresh for 10 minutes
    gcTime: 15 * 60 * 1000, // Keep in cache for 15 minutes
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
        console.log("🚨 Get order details error:", query.error.message);
      }
      options.onError(query.error);
    }
  }, [query.isError, query.error]);

  return query;
};
