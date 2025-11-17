import { useQuery } from "@tanstack/react-query";
import { cinemaService } from "@Services/Cinema/cinemaService";

export const useCinemaCities = () => {
  return useQuery<string[], Error>({
    queryKey: ["cinema-cities"],
    queryFn: () => cinemaService.getAllCities(),
    staleTime: 10 * 60 * 1000,
  });
};
