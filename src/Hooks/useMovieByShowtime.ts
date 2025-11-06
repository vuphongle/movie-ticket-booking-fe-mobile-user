import { useQuery } from "@tanstack/react-query";
import { movieService } from "@Services/movie";
import { Movie } from "@Types/movieTypes";

/**
 * Lấy thông tin phim theo mã suất chiếu (showtimeId)
 */
export const useMovieByShowtime = (showtimeId?: number, enabled: boolean = true) => {
  const {
    data: movie,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Movie>({
    queryKey: ["movie-by-showtime", showtimeId],
    queryFn: async () => {
      if (!showtimeId) throw new Error("Thiếu showtimeId");
      return await movieService.getMovieByShowtime(showtimeId);
    },
    enabled: !!showtimeId && enabled,
  });

  return {
    movie,
    isLoading,
    isError,
    error,
    refetch,
  };
};
