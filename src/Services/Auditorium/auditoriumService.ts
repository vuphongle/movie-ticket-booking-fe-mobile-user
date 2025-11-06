import { HttpService } from "../httpService";
import { SeatDto, SeatServiceInterface } from "@Types/auditoriumTypes";

class AuditoriumService implements SeatServiceInterface {
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
  }

  /**
   * Get seats by auditorium and showtime
   * @param auditoriumId
   * @param showtimeId
   */
  async getSeatsByAuditoriumAndShowtime(
    auditoriumId: number,
    showtimeId: number
  ): Promise<SeatDto[]> {
    return this.httpService.get<SeatDto[]>(
      `/public/auditoriums/${auditoriumId}/showtimes/${showtimeId}/seats`,
      { skipAuth: false }
    );
  }
}

export const auditoriumService = new AuditoriumService();
