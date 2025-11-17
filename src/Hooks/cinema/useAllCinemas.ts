import { useQuery } from "@tanstack/react-query";
import { cinemaService } from "@Services/Cinema/cinemaService";
import { Cinema } from "@Types/cinemaTypes";

export const useAllCinemas = () => {
  return useQuery<Cinema[], Error>({
    queryKey: ["cinemas"],
    queryFn: () => cinemaService.getAllCinemas(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};