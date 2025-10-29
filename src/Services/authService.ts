import { httpService } from "./httpService";
import type { LoginRequest, LoginResponse } from "@Types/authTypes";

/**
 * Authentication Service
 * Handles login API call
 */

const API_BASE_URL = "https://gocinema.io.vn/api";

/**
 * Login with email and password
 * @param credentials - Email and password
 * @returns LoginResponse with user data and tokens
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await httpService.post<LoginResponse>(
      `${API_BASE_URL}/public/auth/login`,
      credentials
    );

    // Store tokens after successful login
    if (response.accessToken) {
      await httpService.setAuthTokens(
        response.accessToken,
        response.refreshToken || undefined
      );
    }

    return response;
  } catch (error) {
    throw error;
  }
};

export const authService = {
  login,
};
