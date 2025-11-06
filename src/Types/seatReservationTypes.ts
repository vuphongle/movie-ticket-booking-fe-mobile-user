export interface SeatReservationRequest {
  seatId: number;
  showtimeId: number;
}

export interface SeatStatusResponse {
  seatId: number;
  showtimeId: number;
  status: string | null;
}

export interface CancelMultipleSeatsRequest {
  showtimeId: number;
  seatIds: number[];
}

export interface ReservationServiceInterface {
  bookSeat: (body: SeatReservationRequest) => Promise<void>;
  cancelSeat: (body: SeatReservationRequest) => Promise<void>;
  cancelSeatMulti: (body: CancelMultipleSeatsRequest) => Promise<void>;
  checkSeatStatus: (seatId: number, showtimeId: number) => Promise<SeatStatusResponse>;
}
