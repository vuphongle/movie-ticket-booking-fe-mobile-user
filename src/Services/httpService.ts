import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * HTTP Service with automatic token attachment and refresh
 * Handles authentication headers and token refresh logic
 */

interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}

interface HttpServiceConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  retryCount?: number;
  retryDelay?: number;
}

// TODO: Update with your actual API base URL from env
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8080/api";
const AUTH_TOKEN_KEY = "@gocinema:auth_token";
const REFRESH_TOKEN_KEY = "@gocinema:refresh_token";

export class HttpService {
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: QueueItem[] = [];

  constructor(baseURL?: string) {
    this.axiosInstance = axios.create({
      baseURL: baseURL || API_BASE_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      this.handleRequest,
      this.handleRequestError
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      this.handleResponse,
      this.handleResponseError
    );
  }

  private handleRequest = async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    try {
      // Log request in development (only log non-auth endpoints to reduce noise)
      if (__DEV__ && !config.url?.includes('/auth/')) {
        console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`, {
          params: config.params,
          data: config.data,
        });
      }

      // Skip auth for public endpoints
      if (this.isPublicEndpoint(config.url || "")) {
        return config;
      }

      // Attach auth token
      const token = await this.getStoredToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      return config;
    }
  };

  private handleRequestError = (error: any) => {
    return Promise.reject(error);
  };

  private handleResponse = (response: AxiosResponse): AxiosResponse => {
    // Log response in development (only log non-auth endpoints to reduce noise)
    if (__DEV__ && !response.config.url?.includes('/auth/')) {
      console.log(
        `✅ [API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`,
        {
          status: response.status,
          data: response.data,
        }
      );
    }
    return response;
  };

  private handleResponseError = async (error: any) => {
    const originalRequest = error.config;

    // Handle non-401 errors
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Handle 401 with refresh token logic
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (this.isRefreshing) {
        // Queue the request while refreshing
        return new Promise((resolve, reject) => {
          this.failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return this.axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      this.isRefreshing = true;

      try {
        const newToken = await this.refreshToken();
        this.processQueue(newToken, null);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return this.axiosInstance(originalRequest);
      } catch (refreshError) {
        this.processQueue(null, refreshError);
        await this.clearAuth();
        // TODO: Navigate to login screen
        return Promise.reject(refreshError);
      } finally {
        this.isRefreshing = false;
      }
    }

    return Promise.reject(error);
  };

  private processQueue(token: string | null, error: any): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else if (token) {
        resolve(token);
      }
    });

    this.failedQueue = [];
  }

  private isPublicEndpoint(url: string): boolean {
    const publicEndpoints = [
      "/auth/login",
      "/auth/register",
      "/auth/refresh",
      "/movies",
      "/cinemas",
    ];

    return publicEndpoints.some((endpoint) => url.includes(endpoint));
  }

  private async getStoredToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error("Failed to get auth token:", error);
      return null;
    }
  }

  private async refreshToken(): Promise<string> {
    try {
      const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      // TODO: Update with your actual refresh endpoint
      const response = await this.axiosInstance.post("/auth/refresh", {
        refreshToken,
      });

      const newToken = response.data.accessToken;
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, newToken);

      return newToken;
    } catch (error) {
      throw error;
    }
  }

  private async clearAuth(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY]);
    } catch (error) {
      console.error("Failed to clear auth:", error);
    }
  }

  /**
   * Store authentication tokens
   */
  async setAuthTokens(accessToken: string, refreshToken?: string): Promise<void> {
    try {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, accessToken);
      if (refreshToken) {
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
    } catch (error) {
      console.error("Failed to set auth tokens:", error);
      throw error;
    }
  }

  /**
   * HTTP Methods
   */
  async get<T = any>(url: string, config?: HttpServiceConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: HttpServiceConfig
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: HttpServiceConfig
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: HttpServiceConfig
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete<T = any>(url: string, config?: HttpServiceConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async upload<T = any>(
    url: string,
    formData: FormData,
    config?: HttpServiceConfig & {
      onUploadProgress?: (progressEvent: any) => void;
    }
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.post<T>(url, formData, {
        ...config,
        headers: {
          ...config?.headers,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Error handling
   * Returns error in format compatible with web version
   */
  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      const code = error.response?.data?.code || "UNKNOWN_ERROR";

      // Only log actual network errors, not business logic errors
      if (__DEV__ && !error.response) {
        console.error(`❌ [Network Error]`, message);
      }

      // Create error object with response structure like web
      const apiError: any = new Error(message);
      apiError.name = "ApiError";
      apiError.code = code;
      apiError.status = error.response?.status;
      apiError.response = {
        data: {
          code,
          message,
          ...error.response?.data,
        },
        status: error.response?.status,
      };

      return apiError;
    }

    return error;
  }

  /**
   * Get axios instance for advanced usage
   */
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  /**
   * Set custom header
   */
  setHeader(key: string, value: string): void {
    this.axiosInstance.defaults.headers.common[key] = value;
  }

  /**
   * Remove custom header
   */
  removeHeader(key: string): void {
    delete this.axiosInstance.defaults.headers.common[key];
  }
}

// Export singleton instance
export const httpService = new HttpService();
