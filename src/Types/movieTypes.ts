export enum MovieAge {
  P = "P",
  K = "K",
  T13 = "T13",
  T16 = "T16",
  T18 = "T18",
  C = "C",
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
}

export interface Movie {
  id: number;
  name: string;
  slug: string;
  duration: number;
  description: string;
  poster: string;
  trailer: string;
  age: MovieAge;
  rating: number;
  genres: Genre[];
  graphics: string[];
}

export interface MovieDetail extends Movie {
  nameEn: string;
  releaseYear: number;
  duration: number;
  status: boolean;
  showDate: string;
  translations: string[];
  country: { id: number; name: string; slug: string };
  directors: { id: number; name: string; avatar: string }[];
  actors: { id: number; name: string; avatar: string }[];
  reviews: any[];
}

export interface MovieListParams {
  page?: number;
  limit?: number;
}

export interface MovieServiceInterface {
  getShowingNowMovies: (params?: MovieListParams) => Promise<Movie[]>;
  getComingSoonMovies: (params?: MovieListParams) => Promise<Movie[]>;
  getMovieDetail: (id: number, slug: string) => Promise<MovieDetail>;
  getMovieByShowtime: (showtimeId: number) => Promise<Movie>;
  searchMovies: (keyword: string) => Promise<Movie[]>;
  createReview(formData: FormData): Promise<any>;
  updateReview(formData: FormData): Promise<any>;
  deleteReview(reviewId: number): Promise<any>;
}
