import { HttpService } from "../httpService";
import {
  SeatReservationRequest,
  CancelMultipleSeatsRequest,
  SeatStatusResponse,
  ReservationServiceInterface,
} from "@Types/seatReservationTypes";

class SeatReservationService implements ReservationServiceInterface {
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
  }

  async bookSeat(body: SeatReservationRequest): Promise<void> {
    return this.httpService.post<void>("/seat-reservations/book", body);
  }

  async cancelSeat(body: SeatReservationRequest): Promise<void> {
    return this.httpService.post<void>("/seat-reservations/cancel", body);
  }

  async cancelSeatMulti(body: CancelMultipleSeatsRequest): Promise<void> {
    return this.httpService.post<void>("/public/seat-reservations/cancel-multiple", body);
  }

  async checkSeatStatus(seatId: number, showtimeId: number): Promise<SeatStatusResponse> {
    return this.httpService.get<SeatStatusResponse>(
      `/seats/status?seatId=${seatId}&showtimeId=${showtimeId}`
    );
  }
}

export const seatReservationService = new SeatReservationService();
