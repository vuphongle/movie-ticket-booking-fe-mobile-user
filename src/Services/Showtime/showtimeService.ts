import { HttpService } from "../httpService";
import { ShowtimeDto, ShowtimeServiceInterface, MovieWithShowtimesDto } from "@Types/showtimeTypes";
import { i18n } from "@Locales/i18n";

class ShowtimeService implements ShowtimeServiceInterface {
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
  }

  async getShowtimesByMovie(movieId: number, showDate: string): Promise<ShowtimeDto[]> {
    const dateObj = new Date(showDate);
    const formattedDate = `${String(dateObj.getDate()).padStart(2, "0")}/${String(
      dateObj.getMonth() + 1
    ).padStart(2, "0")}/${dateObj.getFullYear()}`;

    const response = await this.httpService.get<any[]>(
      `/public/movies/${movieId}/showtimes?showDate=${formattedDate}`,
      { skipAuth: true }
    );

    return response.map((st) => {
      const graphics = st.graphicsType?.replace("_", "").toUpperCase() || "2D";
      const translation = st.translationType
        ? st.translationType.toUpperCase() === "SUBTITLING"
          ? i18n.t("SHOWTIME_TRANSLATION_SUB")
          : st.translationType.toUpperCase() === "DUBBING"
          ? i18n.t("SHOWTIME_TRANSLATION_DUB")
          : st.translationType
        : "";

      const format = translation ? `${graphics} - ${translation}` : graphics;

      return {
        id: st.id,
        movieId: st.movie?.id,
        cinema: {
          id: st.auditorium?.cinema?.id,
          name: st.auditorium?.cinema?.name,
          location: st.auditorium?.cinema?.location,
        },
        auditorium: {
          id: st.auditorium?.id,
          name: st.auditorium?.name,
          totalSeats: st.auditorium?.totalSeats,
          totalRows: st.auditorium?.totalRows,
          totalColumns: st.auditorium?.totalColumns,
          type: st.auditorium?.type,
        },
        format,
        date: Array.isArray(st.date)
          ? `${st.date[0]}-${String(st.date[1]).padStart(2, "0")}-${String(st.date[2]).padStart(
              2,
              "0"
            )}`
          : st.date,
        startTime: st.startTime,
      };
    });
  }

  async checkMovieHasShowtimes(movieId: number): Promise<{ hasShowtimes: boolean }> {
    return this.httpService.get<{ hasShowtimes: boolean }>(
      `/public/movies/${movieId}/has-showtimes`,
      { skipAuth: true }
    );
  }

  async getMoviesShowtimesByCinema(cinemaId: number): Promise<MovieWithShowtimesDto[]> {
    return this.httpService.get<MovieWithShowtimesDto[]>(
      `/public/cinemas/${cinemaId}/movies-showtimes`,
      { skipAuth: true }
    );
  }

  async getMoviesShowtimesByCinemaName(cinemaName: string): Promise<MovieWithShowtimesDto[]> {
    return this.httpService.get<MovieWithShowtimesDto[]>(
      `/public/cinemas/${cinemaName}/movies-showtimes-by-cinema-name`,
      { skipAuth: true }
    );
  }
}

export const showtimeService = new ShowtimeService();
