import { useMutation } from "@tanstack/react-query";
import { updateUserProfile } from "@Services/User/userService";
import { UpdateProfileRequest, User } from "@Types/authTypes";
import { handleApiError } from "@Utils";
import { Alert } from "react-native";
import { i18n } from "@Locales/i18n";

interface UseUpdateProfileOptions {
  onSuccess?: (user: User) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook to update user profile
 * Handles API call, loading state, and error handling
 */
export const useUpdateProfile = (options?: UseUpdateProfileOptions) => {
  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      try {
        const updatedUser = await updateUserProfile(data);
        return updatedUser;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      if (__DEV__) {
        console.log("🚨 Update profile error:", error.message);
      }

      // Show error alert
      Alert.alert(
        i18n.t("PROFILE_UPDATE_ERROR_TITLE"),
        error.message || i18n.t("PROFILE_UPDATE_ERROR_MESSAGE"),
        [{ text: i18n.t("COMMON_OK") }]
      );

      options?.onError?.(error);
    },
  });
};
