export type AdditionalServiceType = "SINGLE" | "COMBO";

export interface AdditionalService {
  id: number;
  name: string;
  description: string;
  thumbnail?: string;
  type: AdditionalServiceType;
  productId?: number;
  defaultQuantity?: number;
  status: boolean;
}

export interface AdditionalServiceItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    description?: string;
    thumbnail?: string;
    unit?: string;
  };
}

export interface AdditionalServicePrice {
  price: number;
  priceId: number;
}

export interface AdditionalServiceInterface {
  getAllServices: () => Promise<AdditionalService[]>;
  getServicePrice: (id: number) => Promise<AdditionalServicePrice>;
  getServiceItems: (id: number) => Promise<AdditionalServiceItem[]>;
}
