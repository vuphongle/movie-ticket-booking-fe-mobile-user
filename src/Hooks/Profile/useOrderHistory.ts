import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  fetchOrderHistory,
  downloadOrderPdf,
  profileKeys,
} from "@Services/Profile/profileService";
import type { OrderHistory, OrderStatus } from "@Types/profile/profileTypes";

interface UseOrderHistoryOptions {
  initialStatus?: OrderStatus;
  initialSearch?: string;
}

/**
 * Hook to fetch and manage order history with filters
 */
export const useOrderHistory = (options?: UseOrderHistoryOptions) => {
  const [status, setStatus] = useState<OrderStatus | undefined>(
    options?.initialStatus
  );
  const [searchTerm, setSearchTerm] = useState(options?.initialSearch || "");

  const queryKey = useMemo(
    () => [...profileKeys.orders(), { status, search: searchTerm }],
    [status, searchTerm]
  );

  const query = useQuery({
    queryKey,
    queryFn: () =>
      fetchOrderHistory({
        status,
        search: searchTerm,
      }),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter orders locally by search term
  const filteredOrders = useMemo(() => {
    if (!query.data || !searchTerm) return query.data || [];

    const lowerSearch = searchTerm.toLowerCase();
    return query.data.filter((order) => {
      const movieName = order.showtime?.movie?.name?.toLowerCase() || "";
      const cinemaName =
        order.showtime?.auditorium?.cinema?.name?.toLowerCase() || "";
      return movieName.includes(lowerSearch) || cinemaName.includes(lowerSearch);
    });
  }, [query.data, searchTerm]);

  return {
    ...query,
    orders: filteredOrders,
    status,
    setStatus,
    searchTerm,
    setSearchTerm,
  };
};

/**
 * Hook to download order PDF
 */
export const useDownloadOrderPdf = () => {
  return useMutation({
    mutationFn: (orderId: number) => downloadOrderPdf(orderId),
  });
};

/**
 * Hook to get orders by status
 */
export const useOrdersByStatus = (targetStatus?: OrderStatus) => {
  const { data: orders, isLoading } = useQuery({
    queryKey: profileKeys.orders(),
    queryFn: () => fetchOrderHistory(),
    staleTime: 2 * 60 * 1000,
  });

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    if (!targetStatus) return orders;
    return orders.filter((order) => order.status === targetStatus);
  }, [orders, targetStatus]);

  return {
    orders: filteredOrders,
    isLoading,
  };
};

/**
 * Hook to get order statistics
 */
export const useOrderStats = () => {
  const { data: orders, isLoading } = useQuery({
    queryKey: profileKeys.orders(),
    queryFn: () => fetchOrderHistory(),
    staleTime: 2 * 60 * 1000,
  });

  const stats = useMemo(() => {
    if (!orders) {
      return {
        total: 0,
        confirmed: 0,
        cancelled: 0,
        pending: 0,
      };
    }

    return {
      total: orders.length,
      confirmed: orders.filter((o) => o.status === "CONFIRMED").length,
      cancelled: orders.filter((o) => o.status === "CANCELLED").length,
      pending: orders.filter((o) => o.status === "PENDING").length,
    };
  }, [orders]);

  return {
    stats,
    isLoading,
  };
};
