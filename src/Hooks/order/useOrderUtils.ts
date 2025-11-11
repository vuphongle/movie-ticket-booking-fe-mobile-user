import type { Order, OrderSummary } from "@Types/orderTypes";

/**
 * Utility functions for Order data manipulation
 * Reusable business logic for order-related operations
 */
export const useOrderUtils = () => {
  /**
   * Transform Order to OrderSummary for easier UI consumption
   */
  const getOrderSummary = (order: Order): OrderSummary => {
    const movie = order.showtime.movie;
    const cinema = order.showtime.auditorium.cinema;
    const showDate = Array.isArray(order.showtime.date)
      ? `${order.showtime.date[2]}/${order.showtime.date[1]}/${order.showtime.date[0]}`
      : new Date(order.showtime.date).toLocaleDateString("vi-VN");

    return {
      totalTickets: order.ticketItems.length,
      totalServices: order.serviceItems.length,
      movieName: movie.name,
      cinemaName: cinema.name,
      showDate,
      showTime: order.showtime.startTime,
      auditoriumName: order.showtime.auditorium.name,
      seatCodes: order.ticketItems.map((item) => item.seat.code),
    };
  };

  /**
   * Format order creation date for display
   */
  const formatOrderDate = (createdAt: number[]): string => {
    if (Array.isArray(createdAt)) {
      // Format: [year, month, day, hour, minute, second, nanoseconds]
      const [year, month, day, hour, minute] = createdAt;
      const date = new Date(year, month - 1, day, hour, minute);
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return new Date(createdAt).toLocaleDateString("vi-VN");
  };

  /**
   * Get status configuration for UI display
   */
  const getOrderStatusConfig = (status: Order["status"]) => {
    switch (status) {
      case "CONFIRMED":
        return {
          label: "Đã thanh toán",
          color: "#22c55e", // green
          bgColor: "#dcfce7",
        };
      case "PENDING":
        return {
          label: "Chờ thanh toán",
          color: "#f59e0b", // amber
          bgColor: "#fef3c7",
        };
      case "CANCELLED":
        return {
          label: "Đã hủy",
          color: "#ef4444", // red
          bgColor: "#fee2e2",
        };
      case "RETURNED":
        return {
          label: "Đã trả vé",
          color: "#6b7280", // gray
          bgColor: "#f3f4f6",
        };
      default:
        return {
          label: "Không xác định",
          color: "#6b7280",
          bgColor: "#f3f4f6",
        };
    }
  };

  /**
   * Check if order can view PDF
   */
  const canViewPdf = (order: Order): boolean => {
    return order.status === "CONFIRMED" && !!order.pdfPath;
  };

  /**
   * Check if order can view QR code
   */
  const canViewQrCode = (order: Order): boolean => {
    return order.status === "CONFIRMED" && !!order.qrCodePath;
  };

  return {
    getOrderSummary,
    formatOrderDate,
    getOrderStatusConfig,
    canViewPdf,
    canViewQrCode,
  };
};
