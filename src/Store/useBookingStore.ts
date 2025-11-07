import { create } from "zustand";

interface Seat {
  id: number;
  row: string;
  number: number;
  type: "normal" | "vip" | "couple";
  status: "active" | "inactive" | "booked" | "held";
  reservationStatus: "booked" | "held" | "cancelled";
  price: number;
  priceId?: number;
}

interface ServiceItem {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  thumbnail?: string;
  type: "COMBO" | "SINGLE";
}

interface Movie {
  id: number;
  name: string;
  slug: string;
  duration?: number;
}

interface BookingState {
  movie?: Movie;
  showtimeId?: number;
  cinema?: string;
  auditorium?: string;
  showtime?: string;
  seats: Seat[];
  services: ServiceItem[];

  // Tổng tiền (tính động)
  totalPrice: number;

  // Actions
  setBookingInfo: (data: Partial<BookingState>) => void;
  addSeat: (seat: Seat) => void;
  removeSeat: (seatId: number) => void;
  clearSeats: () => void;

  addService: (service: ServiceItem) => void;
  updateServiceQty: (id: number, quantity: number) => void;
  updateServicePrice: (id: number, price: number) => void;
  removeService: (id: number) => void;
  clearServices: () => void;
  clearAll: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  movie: undefined,
  showtimeId: undefined,
  cinema: undefined,
  auditorium: undefined,
  showtime: undefined,
  seats: [],
  services: [],
  totalPrice: 0,

  setBookingInfo: (data) => set({ ...get(), ...data }),

  addSeat: (seat) => {
    const seats = [...get().seats, seat];
    const total =
      seats.reduce((sum, s) => sum + s.price, 0) +
      get().services.reduce((sum, s) => sum + s.price * s.quantity, 0);
    set({ seats, totalPrice: total });
  },

  removeSeat: (seatId) => {
    const seats = get().seats.filter((s) => s.id !== seatId);
    const total =
      seats.reduce((sum, s) => sum + s.price, 0) +
      get().services.reduce((sum, s) => sum + s.price * s.quantity, 0);
    set({ seats, totalPrice: total });
  },

  clearSeats: () => set({ seats: [] }),

  addService: (service) => {
    const updated = [...get().services, service];
    const total =
      get().seats.reduce((s, x) => s + x.price, 0) +
      updated.reduce((sum, s) => sum + s.price * s.quantity, 0);
    set({ services: updated, totalPrice: total });
  },

  updateServiceQty: (id, quantity) => {
    const clampedQty = Math.max(0, Math.min(quantity, 5));

    const updated = get().services.map((s) => (s.id === id ? { ...s, quantity: clampedQty } : s));

    const total =
      get().seats.reduce((sum, s) => sum + s.price, 0) +
      updated.reduce((sum, s) => sum + s.price * s.quantity, 0);

    set({ services: updated, totalPrice: total });
  },

  updateServicePrice: (id, price) => {
    const updated = get().services.map((s) => (s.id === id ? { ...s, price } : s));

    const total =
      get().seats.reduce((sum, s) => sum + s.price, 0) +
      updated.reduce((sum, s) => sum + s.price * s.quantity, 0);

    set({ services: updated, totalPrice: total });
  },

  removeService: (id) => {
    const updated = get().services.filter((s) => s.id !== id);
    const total =
      get().seats.reduce((s, x) => s + x.price, 0) +
      updated.reduce((sum, s) => sum + s.price * s.quantity, 0);
    set({ services: updated, totalPrice: total });
  },

  clearServices: () => set({ services: [] }),

  clearAll: () => set({ seats: [], services: [], totalPrice: 0 }),
}));
