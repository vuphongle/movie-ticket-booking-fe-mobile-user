import { useQuery } from "@tanstack/react-query";
import { cinemaService } from "@Services/Cinema/cinemaService";

export const useCinemaNames = () => {
  return useQuery<string[], Error>({
    queryKey: ["cinema-names"],
    queryFn: () => cinemaService.getAllCinemaNames(),
    staleTime: 10 * 60 * 1000,
  });
};
