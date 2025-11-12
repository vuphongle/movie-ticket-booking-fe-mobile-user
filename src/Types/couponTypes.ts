export interface CouponDetailDto {
  id: number;
  couponId: number;
  enabled: boolean;
  targetType: string;
  targetRefId: number | null;
  benefitType: string;
  percent: number | null;
  amount: number | null;
  giftServiceId: number | null;
  giftQuantity: number | null;
  lineMaxDiscount: number | null;
  minQuantity: number | null;
  limitQuantityApplied: number;
  minOrderTotal: number | null;
  detailUsagelimit: number | null;
  detailUsedCount: number;
  selectionStrategy: string | null;
  notes: string | null;
  createdAt: number;
  updatedAt: number;
  terms: {
    id: number;
    percent?: number | null;
    amount?: number | null;
    giftServiceId?: number | null;
    giftQuantity?: number | null;
    limitQuantityApplied?: number;
    detailUsedCount?: number;
  };
}

export interface CouponDto {
  id: number;
  code: string;
  name: string;
  description: string;
  status: boolean;
  startDate: number;
  endDate: number;
  createdAt: number;
  updatedAt: number;
  kind: string;
  details: CouponDetailDto[];
}

// Request - Response
export interface CouponPreviewRequest {
  tickets: { seatTypeId: number; qty: number; unitPrice: number }[];
  services: { serviceId: number; qty: number; unitPrice: number }[];
}

export interface CouponPreviewResponse {
  totalDiscount: number;
  detailResults: {
    detailId: number;
    applied: boolean;
    reason: string;
    giftServiceId: number | null;
    lineDiscount: number;
    affectedQuantity: number;
  }[];
  gifts: any[];
}

export interface CouponApplyRequest {
  orderId: number;
  couponId: number;
  couponCode: string;
  cart: CouponPreviewRequest;
}

export interface CouponApplyResponse {
  status: string;
  idempotentToken: string;
  appliedDetailIds: number[];
  previewResult: CouponPreviewResponse;
  errorMessage: string | null;
}

// Service Interface
export interface CouponServiceInterface {
  getAllCoupons: () => Promise<CouponDto[]>;
  getCouponByCode: (code: string) => Promise<CouponDto>;
  previewCoupon: (id: number, body: CouponPreviewRequest) => Promise<CouponPreviewResponse>;
  previewAllCoupons: (body: CouponPreviewRequest) => Promise<CouponPreviewResponse>;
  applyCoupon: (body: CouponApplyRequest) => Promise<CouponApplyResponse>;
  getAllCouponDetails: () => Promise<CouponDetailDto[]>;
}
