import { useQuery } from "@tanstack/react-query";
import { auditoriumService } from "@Services/Auditorium";
import { SeatDto } from "@Types/auditoriumTypes";

interface UseSeatsParams {
  auditoriumId: number;
  showtimeId: number;
  enabled?: boolean;
}

export const useSeats = ({ auditoriumId, showtimeId, enabled = true }: UseSeatsParams) => {
  const {
    data: seats = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<SeatDto[], Error>({
    queryKey: ["seats", auditoriumId, showtimeId],
    queryFn: () => auditoriumService.getSeatsByAuditoriumAndShowtime(auditoriumId, showtimeId),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return { seats, isLoading, isError, error, refetch };
};
