import { HttpService } from "../httpService";
import { Cinema, Auditorium, CinemaServiceInterface } from "@Types/cinemaTypes";

class CinemaService implements CinemaServiceInterface {
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
  }

  /** Get list cinema names */
  async getAllCinemaNames(): Promise<string[]> {
    return this.httpService.get<string[]>("/public/cinemas/getAllNames", {
      skipAuth: true,
    });
  }

  /** Get list of cities having cinemas */
  async getAllCities(): Promise<string[]> {
    return this.httpService.get<string[]>("/public/cinemas/getAllCities", {
      skipAuth: true,
    });
  }

  /** Get all cinemas */
  async getAllCinemas(): Promise<Cinema[]> {
    return this.httpService.get<Cinema[]>("/public/cinemas", {
      skipAuth: true,
    });
  }

  /** Get cinema detail */
  async getCinemaById(cinemaId: number): Promise<Cinema> {
    return this.httpService.get<Cinema>(`/public/cinemas/${cinemaId}`, {
      skipAuth: true,
    });
  }

  /** Get auditoriums by cinema ID */
  async getAuditoriumsByCinemaId(cinemaId: number): Promise<Auditorium[]> {
    return this.httpService.get<Auditorium[]>(`/public/cinemas/${cinemaId}/auditoriums`, {
      skipAuth: true,
    });
  }
}

export const cinemaService = new CinemaService();
