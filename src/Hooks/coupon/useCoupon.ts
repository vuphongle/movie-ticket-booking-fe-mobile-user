import { useQuery, useMutation } from "@tanstack/react-query";
import { couponService } from "@Services/Coupon";
import {
  CouponDto,
  CouponPreviewRequest,
  CouponPreviewResponse,
  CouponApplyRequest,
  CouponApplyResponse,
  CouponDetailDto,
} from "@Types/couponTypes";

// Lấy toàn bộ coupon
export const useCoupons = () => {
  return useQuery<CouponDto[], Error>({
    queryKey: ["coupons"],
    queryFn: () => couponService.getAllCoupons(),
    staleTime: 1000 * 60 * 5,
  });
};

// Lấy coupon theo mã
export const useCouponByCode = (code: string, enabled = true) => {
  return useQuery<CouponDto, Error>({
    queryKey: ["coupon-by-code", code],
    queryFn: () => couponService.getCouponByCode(code),
    enabled: !!code && enabled,
  });
};

// Preview coupon cho giỏ hàng cụ thể
export const usePreviewCoupon = () => {
  return useMutation<CouponPreviewResponse, Error, { id: number; body: CouponPreviewRequest }>({
    mutationFn: ({ id, body }) => couponService.previewCoupon(id, body),
  });
};

// Preview toàn bộ coupon khả dụng
export const usePreviewAllCoupons = () => {
  return useMutation<CouponPreviewResponse, Error, { body: CouponPreviewRequest }>({
    mutationFn: ({ body }) => couponService.previewAllCoupons(body),
  });
};

// Apply coupon
export const useApplyCoupon = () => {
  return useMutation<CouponApplyResponse, Error, CouponApplyRequest>({
    mutationFn: (body) => couponService.applyCoupon(body),
  });
};

// Lấy chi tiết coupon
export const useCouponDetails = () => {
  return useQuery<CouponDetailDto[], Error>({
    queryKey: ["coupon-details"],
    queryFn: () => couponService.getAllCouponDetails(),
    staleTime: 1000 * 60 * 10,
  });
};
