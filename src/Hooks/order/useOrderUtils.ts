import type { Order, OrderSummary } from "@Types/orderTypes";
import { useTranslation } from "@Hooks/useTranslation";
import { getMovieTitle } from "@Utils";

/**
 * Utility functions for Order data manipulation
 * Reusable business logic for order-related operations
 */
export const useOrderUtils = () => {
  const { t, language } = useTranslation();
  const locale = language === "vi" ? "vi-VN" : "en-US";

  /**
   * Transform Order to OrderSummary for easier UI consumption
   */
  const getOrderSummary = (order: Order): OrderSummary => {
    const movie = order.showtime.movie;
    const cinema = order.showtime.auditorium.cinema;
    const showDate = Array.isArray(order.showtime.date)
      ? new Date(
          order.showtime.date[0],
          order.showtime.date[1] - 1,
          order.showtime.date[2]
        ).toLocaleDateString(locale)
      : new Date(order.showtime.date).toLocaleDateString(locale);

    return {
      totalTickets: order.ticketItems.length,
      totalServices: order.serviceItems.length,
      movieName: getMovieTitle(movie, language),
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
      return date.toLocaleDateString(locale, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return new Date(createdAt).toLocaleDateString(locale);
  };

  /**
   * Get status configuration for UI display
   */
  const getOrderStatusConfig = (status: Order["status"]) => {
    switch (status) {
      case "CONFIRMED":
        return {
          label: t("ORDERS_STATUS_CONFIRMED"),
          color: "#22c55e", // green
          bgColor: "#dcfce7",
        };
      case "PENDING":
        return {
          label: t("ORDERS_STATUS_PENDING"),
          color: "#f59e0b", // amber
          bgColor: "#fef3c7",
        };
      case "CANCELLED":
        return {
          label: t("ORDERS_STATUS_CANCELLED"),
          color: "#ef4444", // red
          bgColor: "#fee2e2",
        };
      case "RETURNED":
        return {
          label: t("ORDERS_STATUS_RETURNED"),
          color: "#6b7280", // gray
          bgColor: "#f3f4f6",
        };
      default:
        return {
          label: t("ORDERS_STATUS_UNKNOWN"),
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
