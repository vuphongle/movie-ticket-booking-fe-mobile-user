import { useQuery } from "@tanstack/react-query";
import { cinemaService } from "@Services/Cinema/cinemaService";
import { Auditorium } from "@Types/cinemaTypes";

export const useAuditoriumsByCinema = (cinemaId: number, enabled = true) => {
  return useQuery<Auditorium[], Error>({
    queryKey: ["auditoriums", cinemaId],
    queryFn: () => cinemaService.getAuditoriumsByCinemaId(cinemaId),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};
