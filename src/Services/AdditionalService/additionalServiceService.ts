import { HttpService } from "../httpService";
import {
  AdditionalService,
  AdditionalServiceItem,
  AdditionalServicePrice,
  AdditionalServiceInterface,
} from "@Types/additionalServiceTypes";

class AdditionalServiceService implements AdditionalServiceInterface {
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
  }

  /**
   * Get all additional services (metadata)
   */
  async getAllServices(): Promise<AdditionalService[]> {
    return this.httpService.get<AdditionalService[]>("/additional-services");
  }

  /**
   * Get price for a specific additional service
   * @param id - service id
   */
  async getServicePrice(id: number): Promise<AdditionalServicePrice> {
    return this.httpService.get<AdditionalServicePrice>(`/additional-services/${id}/price`);
  }

  /**
   * Get items inside a combo service
   * @param id - service id
   */
  async getServiceItems(id: number): Promise<AdditionalServiceItem[]> {
    return this.httpService.get<AdditionalServiceItem[]>(`/additional-services/${id}/items`);
  }
}

export const additionalServiceService = new AdditionalServiceService();
