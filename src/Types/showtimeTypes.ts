export interface ShowtimeDto {
  id: number;
  movieId: number;
  cinema: {
    id: number;
    name: string;
    location: string;
  };
  auditorium: {
    id: number;
    name: string;
    totalSeats: number;
    totalRows: number;
    totalColumns: number;
    type: string;
  };
  format: string;
  date: string;
  startTime: string;
}

export interface ShowtimeDto2 {
  id: number;
  date: number[];
  startTime: string;
  endTime: string;
  graphicsType: string;
  translationType: string;
  cinemaId: number;
  cinemaName: string;
  cinemaLocation: string;
  auditoriumId: number;
  auditoriumName: string;
  auditoriumTotalSeats: number;
  auditoriumTotalRows: number;
  auditoriumTotalColumns: number;
  auditoriumType: string;
  createdAt: number;
  updatedAt: number;
}

export interface MovieWithShowtimesDto {
  id: number;
  name: string;
  nameEn: string;
  description: string;
  duration: number;
  poster: string;
  rating: number;
  releaseYear: number;
  age: string;
  trailer: string;
  status: boolean;
  slug: string;
  createdAt: number;
  updatedAt: number;
  graphics: string[];
  translations: string[];
  countryId: number | null;
  showtimes: ShowtimeDto2[];
}

export interface ShowtimeServiceInterface {
  getShowtimesByMovie: (movieId: number, showDate: string) => Promise<ShowtimeDto[]>;
  checkMovieHasShowtimes: (movieId: number) => Promise<{ hasShowtimes: boolean }>;
  getMoviesShowtimesByCinema: (cinemaId: number) => Promise<MovieWithShowtimesDto[]>;
  getMoviesShowtimesByCinemaName: (cinemaName: string) => Promise<MovieWithShowtimesDto[]>;
}
