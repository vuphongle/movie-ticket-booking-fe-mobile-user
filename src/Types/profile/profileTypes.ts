/**
 * User Profile Types
 */
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: string; // ISO date string (YYYY-MM-DD)
  avatar?: string;
  role: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  name: string;
  phone: string;
  dob: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UploadAvatarResponse {
  url: string;
}

/**
 * Member Info Types
 */
export type MemberTier = "Bronze" | "Silver" | "Gold" | "Platinum";

export interface MemberInfo {
  id: string;
  userId: number;
  tier: MemberTier;
  points: number;
  nextTierPoints: number;
  benefits: MemberBenefit[];
  pointsHistory?: PointsTransaction[];
}

export interface MemberBenefit {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface PointsTransaction {
  id: string;
  date: string;
  action: string;
  points: number; // positive for earned, negative for spent
  balance: number;
}

/**
 * Order History Types
 */
export type OrderStatus = "CONFIRMED" | "CANCELLED" | "PENDING";
export type PaymentMethod = "CASH" | "CARD" | "WALLET" | "BANKING";
export type GraphicsType = "2D" | "3D" | "IMAX";
export type TranslationType = "SUBTITLE" | "DUBBING";

export interface OrderHistory {
  id: number;
  status: OrderStatus;
  totalPrice: number;
  discount: number;
  createdAt: number[]; // [year, month, day, hour, minute, second]
  qrCodePath?: string;
  requestSnapshot?: string;
  showtime: Showtime;
  ticketItems: TicketItem[];
  serviceItems?: ServiceItem[];
}

export interface Showtime {
  id: number;
  startTime: string;
  endTime: string;
  date: string;
  graphicsType: GraphicsType;
  translationType: TranslationType;
  movie: Movie;
  auditorium: Auditorium;
}

export interface Movie {
  id: number;
  name: string;
  poster: string;
  duration: number;
  releaseDate: string;
}

export interface Auditorium {
  id: number;
  name: string;
  cinema: Cinema;
}

export interface Cinema {
  id: number;
  name: string;
  address: string;
  city: string;
}

export interface TicketItem {
  id: number;
  price: number;
  seat: Seat;
}

export interface Seat {
  id: number;
  code: string;
  row: string;
  column: number;
  type: string;
}

export interface ServiceItem {
  id: number;
  quantity: number;
  price: number;
  additionalService: AdditionalService;
}

export interface AdditionalService {
  id: number;
  name: string;
  price: number;
  image?: string;
}

/**
 * API Response Types
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  code?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  status?: number;
}

/**
 * Settings Types
 */
export interface AppSettings {
  language: "en" | "vi";
  darkMode: boolean;
  notifications: boolean;
  biometricAuth: boolean;
}
