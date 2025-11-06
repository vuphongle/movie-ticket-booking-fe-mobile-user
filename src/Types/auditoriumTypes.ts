export type SeatKindBE = "NORMAL" | "VIP" | "COUPLE";
export type ReservationStatus = "BOOKED" | "HELD" | "CANCELLED";

export interface SeatDto {
  id: number;
  rowIndex: number;
  colIndex: number;
  code: string;
  type: SeatKindBE;
  status: boolean;
  reservationStatus: ReservationStatus;
  price: number;
  priceId: number;
}

export interface SeatServiceInterface {
  getSeatsByAuditoriumAndShowtime: (auditoriumId: number, showtimeId: number) => Promise<SeatDto[]>;
}
