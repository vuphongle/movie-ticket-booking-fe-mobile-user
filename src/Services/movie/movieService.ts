import { HttpService } from "../httpService";
import { Movie, MovieDetail, MovieListParams, MovieServiceInterface } from "@Types/movieTypes";
import type { SearchMovieResult } from "@Types/movieTypes";
import { Platform } from "react-native";

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
    return this.httpService.get<Movie>(`public/movie-by-showtimeId/${showtimeId}`, {
      skipAuth: true,
    });
  }

  async searchMovies(keyword: string): Promise<Movie[]> {
    return this.httpService.get<Movie[]>(
      `public/movies/search?keyword=${encodeURIComponent(keyword)}`,
      { skipAuth: true }
    );
  }

  async createReview(formData: FormData): Promise<any> {
    return this.httpService.post("/reviews", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async updateReview(formData: FormData): Promise<any> {
    return this.httpService.put("/reviews", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async deleteReview(reviewId: number): Promise<any> {
    return this.httpService.delete(`/reviews/${reviewId}`);
  }

  async searchByImage(file: {
    uri: string;
    type?: string;
    fileName?: string;
  }): Promise<SearchMovieResult[]> {
    const formData = new FormData();
    formData.append("file", {
      uri: Platform.OS === "ios" ? file.uri.replace("file://", "") : file.uri,
      type: file.type || "image/jpeg",
      name: file.fileName || `search-${Date.now()}.jpg`,
    } as any);

    const res = await this.httpService.post<{ success: boolean; data: SearchMovieResult[] }>(
      "public/movies/search-by-image",
      formData,
      {
        skipAuth: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res?.data ?? [];
  }
}

export const movieService = new MovieService();
