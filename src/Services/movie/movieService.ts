import { HttpService } from "../httpService";
import {
  Movie,
  MovieDetail,
  MovieListParams,
  MovieServiceInterface,
} from "@Types/movieTypes";

class MovieService implements MovieServiceInterface {
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
  }

  async getShowingNowMovies(params?: MovieListParams): Promise<Movie[]> {
    return this.httpService.get<Movie[]>("public/movies/showing-now", { params, skipAuth: true });
  }

  async getComingSoonMovies(params?: MovieListParams): Promise<Movie[]> {
    return this.httpService.get<Movie[]>("public/movies/coming-soon", { params, skipAuth: true });
  }

  async getMovieDetail(id: number, slug: string): Promise<MovieDetail> {
    return this.httpService.get<MovieDetail>(`public/movies/${id}/${slug}`, { skipAuth: true });
  }

  async getMovieByShowtime(showtimeId: number): Promise<Movie> {
    return this.httpService.get<Movie>(`public/movie-by-showtimeId/${showtimeId}`, { skipAuth: true });
  }

  async searchMovies(keyword: string): Promise<Movie[]> {
    return this.httpService.get<Movie[]>(`public/movies/search?keyword=${encodeURIComponent(keyword)}`, { skipAuth: true });
  }
}

export const movieService = new MovieService();
