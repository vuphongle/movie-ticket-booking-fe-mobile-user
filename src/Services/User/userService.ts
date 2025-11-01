import { httpService } from "../httpService";
import {
  User,
  UpdateProfileRequest,
  UploadResponse,
  ChangePasswordRequest,
} from "@Types/authTypes";
import endpoints from "@Constants/Endpoints";

/**
 * Fetch current user profile
 */
export const fetchUserProfile = async (): Promise<User> => {
  return httpService.get<User>(endpoints.USER.MY_PROFILE);
};

/**
 * Update user profile
 * @param data - Profile data to update (name, phone, dob, avatar)
 * @returns Updated user object
 */
export const updateUserProfile = async (data: UpdateProfileRequest): Promise<User> => {
  return httpService.put<User>(endpoints.USER.UPDATE_PROFILE, data);
};

/**
 * Upload user avatar
 * @param file - FormData containing the avatar file
 * @returns Upload response with URL, filename, size, and content type
 */
export const uploadAvatar = async (file: FormData): Promise<UploadResponse> => {
  return httpService.upload<UploadResponse>(endpoints.USER.UPLOAD_AVATAR, file);
};

/**
 * Change user password
 * @param data - Old password, new password, and confirmation
 * @returns Success message
 */
export const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
  return httpService.put<void>(endpoints.USER.UPDATE_PASSWORD, data);
};

export const userService = {
  fetchUserProfile,
  updateUserProfile,
  uploadAvatar,
  changePassword,
};
