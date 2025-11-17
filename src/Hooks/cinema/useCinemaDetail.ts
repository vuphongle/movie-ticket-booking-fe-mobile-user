import { useQuery } from "@tanstack/react-query";
import { cinemaService } from "@Services/Cinema/cinemaService";
import { Cinema } from "@Types/cinemaTypes";

export const useCinemaDetail = (cinemaId: number, enabled = true) => {
  return useQuery<Cinema, Error>({
    queryKey: ["cinema-detail", cinemaId],
    queryFn: () => cinemaService.getCinemaById(cinemaId),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};
