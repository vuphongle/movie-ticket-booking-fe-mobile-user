import type { User, UserInfo } from "@Types/authTypes";

/**
 * Transform backend User to frontend UserInfo
 * Maps User entity fields to UserInfo structure for AuthContext
 */
export const transformUserToUserInfo = (user: User): UserInfo => {
  return {
    sub: user.id.toString(),
    email: user.email,
    email_verified: user.enabled,
    name: user.name,
    avatar: user.avatar,
    preferred_username: user.name,
    phone: user.phone,
    dob: user.dob,
  };
};

/**
 * Extract phone from UserInfo
 * Handles backward compatibility if phone is not directly available
 */
export const getUserPhone = (user: UserInfo | null): string => {
  if (!user) return "";
  // Check if phone is directly available (new structure)
  if ("phone" in user && typeof user.phone === "string") {
    return user.phone;
  }
  // Fallback to empty string
  return "";
};

/**
 * Extract date of birth from UserInfo
 * Returns ISO date string (YYYY-MM-DD)
 */
export const getUserDob = (user: UserInfo | null): string => {
  if (!user) return "";
  // Check if dob is directly available (new structure)
  if ("dob" in user && typeof user.dob === "string") {
    return user.dob;
  }
  // Fallback to empty string
  return "";
};
