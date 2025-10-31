import { httpService } from "../httpService";
import type { LoginRequest, LoginResponse } from "@Types/authTypes";
import endpoints from "@Constants/Endpoints";

/**
 * Request a password reset email
 */
export const forgotPassword = async (email: string): Promise<void> => {
  await httpService.get<void>(endpoints.AUTH.FORGOT_PASSWORD, { params: { email } });
};

/**
 * Login with email/phone and password
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await httpService.post<LoginResponse>(endpoints.AUTH.LOGIN, credentials);

  // Store tokens after successful login
  if (response.accessToken) {
    await httpService.setAuthTokens(response.accessToken, response.refreshToken || undefined);
  }

  return response;
};

/**
 * Register new user
 */
export const register = async (data: {
  email: string;
  phone: string;
  password: string;
  name: string;
}): Promise<LoginResponse> => {
  const response = await httpService.post<LoginResponse>(endpoints.AUTH.REGISTER, data);

  // Store tokens after successful registration
  if (response.accessToken) {
    await httpService.setAuthTokens(response.accessToken, response.refreshToken || undefined);
  }

  return response;
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  try {
    await httpService.post(endpoints.AUTH.LOGOUT);
  } finally {
    // Clear tokens even if logout request fails
    await httpService.clearAuth();
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async (): Promise<{ accessToken: string }> => {
  const response = await httpService.post<{ accessToken: string }>(endpoints.AUTH.REFRESH_TOKEN);

  if (response.accessToken) {
    await httpService.setAuthTokens(response.accessToken);
  }

  return response;
};

export const authService = {
  login,
  register,
  logout,
  refreshToken,
  forgotPassword,
};
