export type OrderStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "RETURNED";

export type SeatType = "NORMAL" | "VIP" | "COUPLE";

export type AuditoriumType = "STANDARD" | "PREMIUM";

export type GraphicsType = "_2D" | "_3D" | "IMAX";

export type TranslationType = "SUBTITLING" | "DUBBING";

export type AdditionalServiceType = "FOOD" | "DRINK" | "COMBO";

export interface User {
  id: number;
  name: string;
  dob?: number;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  enabled: boolean;
  createdAt: number;
  updatedAt: number;
  cinema?: any;
}

export interface Country {
  id: number;
  name: string;
  slug: string;
  createdAt: number;
  updatedAt: number;
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
  createdAt: number;
  updatedAt: number;
}

export interface Director {
  id: number;
  name: string;
  description: string;
  avatar: string;
  birthday: number;
  createdAt: number;
  updatedAt: number;
}

export interface Actor {
  id: number;
  name: string;
  description: string;
  avatar: string;
  birthday: number;
  createdAt: number;
  updatedAt: number;
}

export interface Review {
  id: number;
  comment: string;
  rating: number;
  feeling: string[];
  images: string[];
  createdAt: number;
  updatedAt: number;
  user: User;
}

export interface Movie {
  id: number;
  name: string;
  nameEn: string;
  slug: string;
  trailer: string;
  description: string;
  poster: string;
  releaseYear: number;
  rating: number;
  duration: number;
  status: boolean;
  showDate: number;
  createdAt: number;
  updatedAt: number;
  publishedAt: number;
  graphics: GraphicsType[];
  translations: TranslationType[];
  age: string;
  country: Country;
  genres: Genre[];
  directors: Director[];
  actors: Actor[];
  reviews: Review[];
}

export interface Cinema {
  id: number;
  name: string;
  address: string;
  mapLocation: string;
  createdAt: number;
  updatedAt: number;
  users: any[];
}

export interface Auditorium {
  id: number;
  name: string;
  totalSeats: number;
  totalRows: number;
  totalColumns: number;
  type: AuditoriumType;
  cinema: Cinema;
  createdAt: number;
  updatedAt: number;
}

export interface Showtime {
  id: number;
  movie: Movie;
  auditorium: Auditorium;
  graphicsType: GraphicsType;
  translationType: TranslationType;
  date: number[];
  startTime: string;
  endTime: string;
  createdAt: number;
  updatedAt: number;
}

export interface Seat {
  id: number;
  rowIndex: number;
  colIndex: number;
  code: string;
  type: SeatType;
  status: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface PriceList {
  id: number;
}

export interface PriceItem {
  id: number;
  priceList: PriceList;
  targetType: string;
  targetId?: number;
  seatType?: SeatType;
  graphicsType?: GraphicsType;
  screeningTimeType?: string;
  dayType?: string;
  auditoriumType: AuditoriumType;
  price: number;
  minQty?: number;
  status: boolean;
}

export interface OrderTicketItem {
  id: number;
  seat: Seat;
  price: number;
  priceItem: PriceItem;
}

export interface AdditionalService {
  id: number;
  name: string;
  type: AdditionalServiceType;
  price: number;
  status: boolean;
}

export interface OrderServiceItem {
  id: number;
  additionalService: AdditionalService;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  user: User;
  showtime: Showtime;
  status: OrderStatus;
  discount: number;
  tempPrice: number;
  discountPrice: number;
  totalPrice: number;
  ticketItems: OrderTicketItem[];
  serviceItems: OrderServiceItem[];
  qrCodePath?: string;
  pdfPath?: string;
  returnedByUser?: User;
  returnedAt?: number[];
  returnedReason?: string;
  createdAt: number[];
  updatedAt: number[];
  requestSnapshot: string;
  platform: string;
}

// Helper types for UI
export interface OrderSummary {
  totalTickets: number;
  totalServices: number;
  movieName: string;
  cinemaName: string;
  showDate: string;
  showTime: string;
  auditoriumName: string;
  seatCodes: string[];
}
