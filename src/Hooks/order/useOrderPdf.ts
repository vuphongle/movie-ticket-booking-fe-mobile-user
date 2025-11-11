import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { orderService } from "@Services/Order";
import { orderKeys } from "@Services/Order";
import { handleApiError } from "@Utils";

interface UseOrderPdfOptions {
  onSuccess?: (pdfUrl: string) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

/**
 * Hook to fetch order PDF URL
 * Uses React Query for caching and automatic refetching
 */
export const useOrderPdf = (orderId: number, options?: UseOrderPdfOptions) => {
  const query = useQuery({
    queryKey: orderKeys.pdf(orderId),
    queryFn: async () => {
      try {
        const pdfUrl = await orderService.fetchOrderPdf(orderId);
        return pdfUrl;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    enabled: (options?.enabled ?? true) && !!orderId,
    staleTime: 30 * 60 * 1000, // Consider data fresh for 30 minutes
    gcTime: 60 * 60 * 1000, // Keep in cache for 1 hour
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
        console.log("🚨 Get order PDF error:", query.error.message);
      }
      options.onError(query.error);
    }
  }, [query.isError, query.error]);

  return query;
};
