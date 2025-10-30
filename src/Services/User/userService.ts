import { httpService } from "../httpService";
import { User } from "@Types/authTypes";
import endpoints from "@Constants/Endpoints";

/**
 * Fetch current user profile
 */
export const fetchUserProfile = async (): Promise<User> => {
  return httpService.get<User>(endpoints.USER.MY_PROFILE);
};

/**
 * Update user profile
 */
export const updateUserProfile = async (data: Partial<User>): Promise<User> => {
  return httpService.put<User>(endpoints.USER.UPDATE_PROFILE, data);
};

/**
 * Upload user avatar
 */
export const uploadAvatar = async (file: FormData): Promise<{ avatarUrl: string }> => {
  return httpService.upload<{ avatarUrl: string }>(
    endpoints.USER.UPLOAD_AVATAR,
    file
  );
};

export const userService = {
  fetchUserProfile,
  updateUserProfile,
  uploadAvatar,
};
