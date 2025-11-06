import { useMutation, useQuery } from "@tanstack/react-query";
import { seatReservationService } from "@Services/SeatReservation";
import {
  SeatReservationRequest,
  CancelMultipleSeatsRequest,
  SeatStatusResponse,
} from "@Types/seatReservationTypes";

// Hook book seat
export const useBookSeat = () => {
  const mutation = useMutation<void, Error, SeatReservationRequest>({
    mutationFn: (body) => seatReservationService.bookSeat(body),
  });
  return mutation;
};

// Hook cancel seat
export const useCancelSeat = () => {
  const mutation = useMutation<void, Error, SeatReservationRequest>({
    mutationFn: (body) => seatReservationService.cancelSeat(body),
  });
  return mutation;
};

// Hook cancel multiple seats
export const useCancelSeatMulti = () => {
  const mutation = useMutation<void, Error, CancelMultipleSeatsRequest>({
    mutationFn: (body) => seatReservationService.cancelSeatMulti(body),
  });
  return mutation;
};

// Hook check seat status
interface UseCheckSeatStatusParams {
  seatId: number;
  showtimeId: number;
  enabled?: boolean;
}

export const useCheckSeatStatus = ({
  seatId,
  showtimeId,
  enabled = true,
}: UseCheckSeatStatusParams) => {
  const { data, isLoading, isError, error, refetch } = useQuery<SeatStatusResponse, Error>({
    queryKey: ["seat-status", seatId, showtimeId],
    queryFn: () => seatReservationService.checkSeatStatus(seatId, showtimeId),
    enabled,
  });

  return { status: data, isLoading, isError, error, refetch };
};
