import { httpService } from "@Services/httpService";
import type {
  UserProfile,
  UpdateProfilePayload,
  ChangePasswordPayload,
  UploadAvatarResponse,
  MemberInfo,
  OrderHistory,
} from "@Types/profile/profileTypes";

/**
 * API Endpoints
 * TODO: Update these with your actual backend endpoints
 */
const PROFILE_ENDPOINTS = {
  MY_PROFILE: "/user/profile",
  UPDATE_PROFILE: "/user/profile",
  CHANGE_PASSWORD: "/user/change-password",
  UPLOAD_AVATAR: "/user/avatar",
  MEMBER_INFO: "/user/member",
  ORDER_HISTORY: "/orders/my-orders",
  ORDER_PDF: (orderId: number) => `/orders/${orderId}/pdf`,
} as const;

/**
 * Query Keys Factory
 * Consistent query keys pattern following TanStack Query best practices
 */
export const profileKeys = {
  all: ["profile"] as const,
  profile: () => [...profileKeys.all, "user"] as const,
  member: () => [...profileKeys.all, "member"] as const,
  orders: () => [...profileKeys.all, "orders"] as const,
  orderDetail: (id: number) => [...profileKeys.orders(), id] as const,
} as const;

/**
 * Profile Service Functions
 */

/**
 * Fetch current user profile
 */
export const fetchUserProfile = async (): Promise<UserProfile> => {
  return httpService.get<UserProfile>(PROFILE_ENDPOINTS.MY_PROFILE);
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  data: UpdateProfilePayload
): Promise<UserProfile> => {
  await httpService.put<void>(PROFILE_ENDPOINTS.UPDATE_PROFILE, data);
  // Refetch profile to get updated data
  return fetchUserProfile();
};

/**
 * Change password
 */
export const changePassword = async (
  data: ChangePasswordPayload
): Promise<void> => {
  return httpService.post<void>(PROFILE_ENDPOINTS.CHANGE_PASSWORD, data);
};

/**
 * Upload avatar
 */
export const uploadAvatar = async (
  file: {
    uri: string;
    type: string;
    name: string;
  }
): Promise<UploadAvatarResponse> => {
  const formData = new FormData();
  formData.append("file", {
    uri: file.uri,
    type: file.type,
    name: file.name,
  } as any);

  return httpService.upload<UploadAvatarResponse>(
    PROFILE_ENDPOINTS.UPLOAD_AVATAR,
    formData
  );
};

/**
 * Update avatar (upload and update profile)
 */
export const updateAvatar = async (file: {
  uri: string;
  type: string;
  name: string;
}): Promise<UserProfile> => {
  const uploadResult = await uploadAvatar(file);
  
  // After upload, fetch updated profile which should include new avatar URL
  return fetchUserProfile();
};

/**
 * Member Info Service Functions
 */

/**
 * Fetch member information
 */
export const fetchMemberInfo = async (): Promise<MemberInfo> => {
  return httpService.get<MemberInfo>(PROFILE_ENDPOINTS.MEMBER_INFO);
};

/**
 * Order History Service Functions
 */

/**
 * Fetch order history with optional filters
 */
export const fetchOrderHistory = async (params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<OrderHistory[]> => {
  return httpService.get<OrderHistory[]>(PROFILE_ENDPOINTS.ORDER_HISTORY, {
    params,
  });
};

/**
 * Download order PDF
 */
export const downloadOrderPdf = async (orderId: number): Promise<string> => {
  const response = await httpService.get<{ url: string }>(
    PROFILE_ENDPOINTS.ORDER_PDF(orderId)
  );
  return response.url;
};
