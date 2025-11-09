import { HttpService } from "../httpService";
import { CreateOrderRequest, PaymentResponse, PaymentServiceInterface } from "@Types/paymentTypes";

class PaymentService implements PaymentServiceInterface {
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
  }

  /**
   * Tạo order mới (POST /orders)
   * @param body - Thông tin order cần tạo
   */
  async createOrder(body: CreateOrderRequest): Promise<PaymentResponse> {
    return this.httpService.post<PaymentResponse>("/orders", body);
  }
}

export const paymentService = new PaymentService();
