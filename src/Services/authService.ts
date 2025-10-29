import { httpService } from "./httpService";
import type { LoginRequest, LoginResponse } from "@Types/authTypes";
import { API_BASE_URL, API_ENDPOINTS } from "@Constants";

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await httpService.post<LoginResponse>(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`,
      credentials
    );

    // Store tokens after successful login
    if (response.accessToken) {
      await httpService.setAuthTokens(response.accessToken, response.refreshToken || undefined);
    }

    return response;
  } catch (error) {
    throw error;
  }
};

export const authService = {
  login,
};
