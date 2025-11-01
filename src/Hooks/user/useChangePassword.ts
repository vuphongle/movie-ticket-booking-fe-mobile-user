import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
import { userService } from "@Services";
import type { ChangePasswordRequest } from "@Types/authTypes";

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
        Alert.alert("Lỗi", "Mật khẩu cũ không đúng. Vui lòng kiểm tra lại.");
      } else if (errorCode === "NEW_PASSWORD_SAME_AS_OLD") {
        Alert.alert("Lỗi", "Mật khẩu mới không được trùng với mật khẩu cũ.");
      } else {
        // Generic error handling
        const errorMessage = error?.message || "Đã xảy ra lỗi khi đổi mật khẩu. Vui lòng thử lại.";
        Alert.alert("Lỗi", errorMessage);
      }

      if (options?.onError) {
        options.onError(error);
      }
    },
  });
};
