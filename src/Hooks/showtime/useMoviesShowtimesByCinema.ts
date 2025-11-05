import { useQuery } from "@tanstack/react-query";
import { showtimeService } from "@Services/Showtime";
import { MovieWithShowtimesDto } from "@Types/showtimeTypes";

export const useMoviesShowtimesByCinema = (cinemaId: number, enabled = true) => {
  const {
    data: movies = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<MovieWithShowtimesDto[], Error>({
    queryKey: ["movies-showtimes-cinema", cinemaId],
    queryFn: () => showtimeService.getMoviesShowtimesByCinema(cinemaId),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return { movies, isLoading, isError, error, refetch };
};

export const useMoviesShowtimesByCinemaName = (cinemaName: string, enabled = true) => {
  const {
    data: movies = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<MovieWithShowtimesDto[], Error>({
    queryKey: ["movies-showtimes-cinema-name", cinemaName],
    queryFn: () => showtimeService.getMoviesShowtimesByCinemaName(cinemaName),
    enabled,
    staleTime: 5 * 60 * 1000,
  });

  return { movies, isLoading, isError, error, refetch };
};
