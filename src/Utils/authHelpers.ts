import type { AuthTokens, UserInfo } from "@Types/authTypes";
import type { LoginResponse } from "@Types/authTypes";
import { transformUserToUserInfo } from "./userTransformUtils";
import { i18n } from "@Locales/i18n";

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

  const userInfo = transformUserToUserInfo(response.user);

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
  const fallback = i18n.t("COMMON_GENERIC_NAME");
  if (!user) return fallback;
  return user.name || user.preferred_username || user.email || fallback;
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
