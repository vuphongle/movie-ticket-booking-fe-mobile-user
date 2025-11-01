import { useMutation } from "@tanstack/react-query";
import { uploadAvatar } from "@Services/User/userService";
import { UploadResponse } from "@Types/authTypes";
import { handleApiError } from "@Utils";
import { Alert, Platform } from "react-native";

interface UseUploadAvatarOptions {
  onSuccess?: (response: UploadResponse) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook to upload user avatar
 * Handles file upload, loading state, and error handling
 */
export const useUploadAvatar = (options?: UseUploadAvatarOptions) => {
  return useMutation({
    mutationFn: async (imagePath: string) => {
      try {
        // Create FormData with the image file
        const formData = new FormData();

        // Extract filename from path
        const filename = imagePath.split("/").pop() || "avatar.jpg";

        // Determine MIME type from filename extension
        const extension = filename.split(".").pop()?.toLowerCase();
        let mimeType = "image/jpeg";

        if (extension === "png") {
          mimeType = "image/png";
        } else if (extension === "jpg" || extension === "jpeg") {
          mimeType = "image/jpeg";
        } else if (extension === "heic") {
          mimeType = "image/heic";
        }

        // Append file to FormData
        formData.append("file", {
          uri: Platform.OS === "android" ? imagePath : imagePath.replace("file://", ""),
          type: mimeType,
          name: filename,
        } as any);

        const response = await uploadAvatar(formData);
        return response;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    onSuccess: (data) => {
      if (__DEV__) {
        console.log("✅ Avatar uploaded successfully:", data.url);
      }
      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      if (__DEV__) {
        console.log("🚨 Upload avatar error:", error.message);
      }

      // Show error alert
      Alert.alert("Tải ảnh thất bại", error.message || "Không thể tải ảnh lên. Vui lòng thử lại.", [
        { text: "OK" },
      ]);

      options?.onError?.(error);
    },
  });
};
