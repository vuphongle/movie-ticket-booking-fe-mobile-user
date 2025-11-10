import { HttpService } from "../httpService";
import {
  CouponDto,
  CouponPreviewRequest,
  CouponPreviewResponse,
  CouponApplyRequest,
  CouponApplyResponse,
  CouponDetailDto,
  CouponServiceInterface,
} from "@Types/couponTypes";

class CouponService implements CouponServiceInterface {
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
  }

  async getAllCoupons(): Promise<CouponDto[]> {
    return this.httpService.get<CouponDto[]>("/coupons");
  }

  async getCouponByCode(code: string): Promise<CouponDto> {
    return this.httpService.get<CouponDto>(`/coupons/coupon-by-code?code=${code}`);
  }

  async previewCoupon(id: number, body: CouponPreviewRequest): Promise<CouponPreviewResponse> {
    return this.httpService.post<CouponPreviewResponse>(`/coupons/${id}/preview`, body);
  }

  async previewAllCoupons(body: CouponPreviewRequest): Promise<CouponPreviewResponse> {
    return this.httpService.post<CouponPreviewResponse>(`/coupons/previews`, body);
  }

  async applyCoupon(body: CouponApplyRequest): Promise<CouponApplyResponse> {
    return this.httpService.post<CouponApplyResponse>(`/coupons/apply`, body);
  }

  async getAllCouponDetails(): Promise<CouponDetailDto[]> {
    return this.httpService.get<CouponDetailDto[]>(`/coupon-details`);
  }
}

export const couponService = new CouponService();
