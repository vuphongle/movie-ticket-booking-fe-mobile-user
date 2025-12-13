import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
import { userService } from "@Services";
import type { ChangePasswordRequest } from "@Types/authTypes";
import { i18n } from "@Locales/i18n";

interface UseChangePasswordOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for changing user password
 * Handles INVALID_OLD_PASSWORD and NEW_PASSWORD_SAME_AS_OLD error codes
 */
export const useChangePassword = (options?: UseChangePasswordOptions) => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => userService.changePassword(data),
    onSuccess: () => {
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
    onError: (error: any) => {
      // Handle specific error codes from API
      const errorCode = error?.code || error?.response?.data?.code;

      if (errorCode === "INVALID_OLD_PASSWORD") {
        Alert.alert(i18n.t("COMMON_ERROR"), i18n.t("AUTH_CHANGE_PASSWORD_INVALID_OLD"));
      } else if (errorCode === "NEW_PASSWORD_SAME_AS_OLD") {
        Alert.alert(i18n.t("COMMON_ERROR"), i18n.t("AUTH_CHANGE_PASSWORD_SAME_AS_OLD"));
      } else {
        // Generic error handling
        const errorMessage = error?.message || i18n.t("AUTH_CHANGE_PASSWORD_GENERIC_ERROR");
        Alert.alert(i18n.t("COMMON_ERROR"), errorMessage);
      }

      if (options?.onError) {
        options.onError(error);
      }
    },
  });
};
