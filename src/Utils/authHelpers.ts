import type { AuthTokens, UserInfo } from "@Types/authTypes";
import type { LoginResponse } from "@Types/authTypes";

/**
 * Transform login response to AuthTokens and UserInfo
 * Centralizes the transformation logic used across the app
 */
export const transformLoginResponse = (
  response: LoginResponse
): { tokens: AuthTokens; userInfo: UserInfo } => {
  const tokens: AuthTokens = {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken || "",
    idToken: "", // API doesn't return idToken
    accessTokenExpirationDate: "",
    tokenType: "Bearer",
    scopes: [],
  };

  const userInfo: UserInfo = {
    sub: response.user.id.toString(),
    email: response.user.email,
    email_verified: true,
    name: response.user.name,
    picture: response.user.avatar,
    roles: [response.user.role],
    preferred_username: response.user.name,
  };

  return { tokens, userInfo };
};

/**
 * Check if user is authenticated based on auth state
 */
export const isUserAuthenticated = (accessToken: string | null, user: UserInfo | null): boolean => {
  return Boolean(accessToken && user);
};

/**
 * Format user display name
 */
export const getUserDisplayName = (user: UserInfo | null): string => {
  if (!user) return "Người dùng";
  return user.name || user.preferred_username || user.email || "Người dùng";
};

/**
 * Check if avatar URL needs domain prefix
 */
export const getFullAvatarUrl = (avatarUrl?: string, apiDomain?: string): string => {
  if (!avatarUrl) return "";

  // If avatar starts with /api, prepend domain
  if (avatarUrl.startsWith("/api") && apiDomain) {
    return `${apiDomain}${avatarUrl}`;
  }

  // If it's already a full URL, return as is
  if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://")) {
    return avatarUrl;
  }

  return avatarUrl;
};
