import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUserProfile,
  updateUserProfile,
  changePassword,
  updateAvatar,
  profileKeys,
} from "@Services/Profile/profileService";
import type {
  UserProfile,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from "@Types/profile/profileTypes";

/**
 * Hook to fetch and manage user profile
 */
export const useProfile = () => {
  return useQuery({
    queryKey: profileKeys.profile(),
    queryFn: fetchUserProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
  });
};

/**
 * Hook to update user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfilePayload) => updateUserProfile(data),
    onSuccess: (data) => {
      // Update cache with new profile data
      queryClient.setQueryData(profileKeys.profile(), data);
      
      // Invalidate to refetch if needed
      queryClient.invalidateQueries({
        queryKey: profileKeys.profile(),
      });
    },
  });
};

/**
 * Hook to change password
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordPayload) => changePassword(data),
  });
};

/**
 * Hook to upload/update avatar
 */
export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: { uri: string; type: string; name: string }) =>
      updateAvatar(file),
    onSuccess: (data) => {
      // Update profile cache with new avatar
      queryClient.setQueryData(profileKeys.profile(), data);
      
      // Invalidate to refetch
      queryClient.invalidateQueries({
        queryKey: profileKeys.profile(),
      });
    },
  });
};

/**
 * Hook to get profile data with optional default values
 */
export const useProfileData = (): UserProfile | null => {
  const { data } = useProfile();
  return data ?? null;
};

/**
 * Hook to check if user is authenticated (has profile)
 */
export const useIsAuthenticated = (): boolean => {
  const { data, isLoading } = useProfile();
  return !isLoading && !!data;
};
