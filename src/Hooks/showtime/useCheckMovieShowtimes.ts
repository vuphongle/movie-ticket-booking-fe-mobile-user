import { useQuery } from "@tanstack/react-query";
import { showtimeService } from "@Services/Showtime";

export const useCheckMovieShowtimes = (movieId: number, enabled = true) => {
  const { data, isLoading, isError, error, refetch } = useQuery<{ hasShowtimes: boolean }, Error>({
    queryKey: ["check-movie-showtimes", movieId],
    queryFn: () => showtimeService.checkMovieHasShowtimes(movieId),
    enabled,
    staleTime: 5 * 60 * 1000,
  });

  return {
    hasShowtimes: data?.hasShowtimes ?? false,
    isLoading,
    isError,
    error,
    refetch,
  };
};
