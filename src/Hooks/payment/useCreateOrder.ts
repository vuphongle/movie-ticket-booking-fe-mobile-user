import { useMutation } from "@tanstack/react-query";
import { paymentService } from "@Services/Payment";
import { CreateOrderRequest, PaymentResponse } from "@Types/paymentTypes";

/**
 * Hook dùng để tạo đơn hàng thanh toán
 */
export const useCreateOrder = () => {
  return useMutation<PaymentResponse, Error, CreateOrderRequest>({
    mutationFn: (body) => paymentService.createOrder(body),
  });
};
