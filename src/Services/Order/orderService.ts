import { httpService } from "../httpService";
import type { Order } from "@Types/orderTypes";
import endpoints from "@Constants/Endpoints";

/**
 * Fetch order history for current user
 * Returns all orders regardless of status
 */
export const fetchOrderHistory = async (): Promise<Order[]> => {
  return httpService.get<Order[]>(endpoints.ORDER.MY_ORDERS);
};

/**
 * Fetch order details by ID
 */
export const fetchOrderById = async (orderId: number): Promise<Order> => {
  return httpService.get<Order>(`${endpoints.ORDER.BY_ID}/${orderId}`);
};

/**
 * Get order PDF URL
 */
export const fetchOrderPdf = async (orderId: number): Promise<string> => {
  return httpService.get<string>(`${endpoints.ORDER.PDF}/${orderId}`);
};

export const orderService = {
  fetchOrderHistory,
  fetchOrderById,
  fetchOrderPdf,
};
