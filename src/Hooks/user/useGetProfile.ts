import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchUserProfile } from "@Services/User/userService";
import { userKeys } from "@Services/User/userKeys";
import { handleApiError } from "@Utils";
import type { User } from "@Types/authTypes";

interface UseGetProfileOptions {
  onSuccess?: (user: User) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

/**
 * Hook to fetch current user profile
 * Uses React Query for caching and automatic refetching
 */
export const useGetProfile = (options?: UseGetProfileOptions) => {
  const query = useQuery({
    queryKey: userKeys.profile(),
    queryFn: async () => {
      try {
        const user = await fetchUserProfile();
        return user;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 2,
  });

  // Handle success callback
  useEffect(() => {
    if (query.isSuccess && query.data && options?.onSuccess) {
      options.onSuccess(query.data);
    }
  }, [query.isSuccess, query.data]);

  // Handle error callback
  useEffect(() => {
    if (query.isError && query.error && options?.onError) {
      if (__DEV__) {
        console.log("🚨 Get profile error:", query.error.message);
      }
      options.onError(query.error);
    }
  }, [query.isError, query.error]);

  return query;
};
