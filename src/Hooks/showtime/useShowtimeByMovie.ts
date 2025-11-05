import { useQuery } from "@tanstack/react-query";
import { showtimeService } from "@Services/Showtime";
import { ShowtimeDto } from "@Types/showtimeTypes";

interface UseShowtimeByMovieParams {
  movieId: number;
  showDate: string;
  enabled?: boolean;
}

export const useShowtimeByMovie = ({
  movieId,
  showDate,
  enabled = true,
}: UseShowtimeByMovieParams) => {
  const {
    data: showtimes = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ShowtimeDto[], Error>({
    // ✅ Thêm showDate vào queryKey để refetch khi đổi ngày
    queryKey: ["showtimesByMovie", movieId, showDate],

    // ✅ Mỗi lần đổi showDate => React Query gọi lại API
    queryFn: () => showtimeService.getShowtimesByMovie(movieId, showDate),

    // ✅ Bật điều kiện
    enabled: enabled && !!movieId && !!showDate,

    // ✅ Tắt cache lâu để luôn refetch nhanh khi đổi ngày
    staleTime: 0,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  return { showtimes, isLoading, isError, error, refetch };
};
