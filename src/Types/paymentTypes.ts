export interface TicketItem {
  seatId: number;
  price: number;
}

export interface ServiceItem {
  additionalServiceId: number;
  quantity: number;
  price: number;
}

export interface CouponGift {
  serviceId: number;
  serviceName: string;
  quantity: number;
  thumbnail?: string;
}

export interface CouponItem {
  detailId: number;
  code: string;
  discount: number;
  type: string;
  gifts?: CouponGift[];
}

export interface DiscountsInfo {
  totalDiscount: number;
  coupons: CouponItem[];
}

export interface CreateOrderRequest {
  showtimeId: number;
  ticketItems: TicketItem[];
  serviceItems?: ServiceItem[];
  discounts?: DiscountsInfo;
  paymentMethod?: string;
  expireSeconds?: number;
}

export interface PaymentResponse {
  url: string;
}

export interface PaymentServiceInterface {
  createOrder: (body: CreateOrderRequest) => Promise<PaymentResponse>;
}
