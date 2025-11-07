import { useQuery } from "@tanstack/react-query";
import { additionalServiceService } from "@Services/AdditionalService";
import {
  AdditionalService,
  AdditionalServicePrice,
  AdditionalServiceItem,
} from "@Types/additionalServiceTypes";

export const useAdditionalServices = () => {
  const { data, isLoading, isError, error, refetch } = useQuery<AdditionalService[], Error>({
    queryKey: ["additional-services"],
    queryFn: () => additionalServiceService.getAllServices(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    services: data ?? [],
    isLoading,
    isError,
    error,
    refetch,
  };
};

export const useAdditionalServicePrice = (id?: number, enabled = true) => {
  const { data, isLoading, isError, error, refetch } = useQuery<AdditionalServicePrice, Error>({
    queryKey: ["additional-service-price", id],
    queryFn: () => additionalServiceService.getServicePrice(id!),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });

  return {
    price: data,
    isLoading,
    isError,
    error,
    refetch,
  };
};

export const useAdditionalServiceItems = (id?: number, enabled = true) => {
  const { data, isLoading, isError, error, refetch } = useQuery<AdditionalServiceItem[], Error>({
    queryKey: ["additional-service-items", id],
    queryFn: () => additionalServiceService.getServiceItems(id!),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });

  return {
    items: data ?? [],
    isLoading,
    isError,
    error,
    refetch,
  };
};
