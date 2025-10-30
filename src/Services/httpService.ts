import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CONFIG } from "@Constants/Configs";
import { handleApiError } from "@Utils/errorHandlerUtils";
import { generateRequestId, delay, getBackoffDelay } from "@Utils/requestUtils";

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
  requestId?: string;
}

const AUTH_TOKEN_KEY = "@gocinema:auth_token";
const REFRESH_TOKEN_KEY = "@gocinema:refresh_token";

export class HttpService {
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: QueueItem[] = [];
  private pendingRequests = new Map<string, AbortController>();

  constructor(baseURL?: string) {
    this.axiosInstance = axios.create({
      baseURL: baseURL || CONFIG.API_BASE_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(this.handleRequest, this.handleRequestError);

    this.axiosInstance.interceptors.response.use(this.handleResponse, this.handleResponseError);
  }

  private handleRequest = async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    try {
      if (__DEV__ && !config.url?.includes("/auth/")) {
        console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`, {
          params: config.params,
          data: config.data,
        });
      }

      if (this.isPublicEndpoint(config.url || "")) {
        return config;
      }

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
    if (__DEV__ && !response.config.url?.includes("/auth/")) {
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

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (this.isRefreshing) {
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

  /**
   * Clear authentication tokens
   */
  async clearAuth(): Promise<void> {
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
   * Setup request with abort controller and cleanup
   */
  private setupRequest(config?: HttpServiceConfig): {
    axiosConfig: AxiosRequestConfig;
    cleanup: () => void;
  } {
    const { skipAuth, requestId, retryCount, retryDelay, ...axiosConfig } = config || {};

    let cleanup = () => {};

    // Setup abort controller if requestId provided
    if (requestId) {
      const controller = new AbortController();
      this.pendingRequests.set(requestId, controller);
      axiosConfig.signal = controller.signal;

      cleanup = () => {
        this.pendingRequests.delete(requestId);
      };
    }

    return { axiosConfig, cleanup };
  }

  /**
   * Execute request with retry logic
   */
  private async executeWithRetry<T>(
    requestFn: () => Promise<T>,
    config?: HttpServiceConfig
  ): Promise<T> {
    const retryCount = config?.retryCount ?? 0;
    let lastError: any;

    for (let attempt = 0; attempt <= retryCount; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;

        // Don't retry on authentication errors or client errors (4xx)
        const status = (error as any)?.response?.status;
        if (status && status >= 400 && status < 500) {
          break;
        }

        // If this is the last attempt, don't delay
        if (attempt === retryCount) {
          break;
        }

        // Wait with exponential backoff before retrying
        const delayMs = getBackoffDelay(attempt, config?.retryDelay ?? 1000);
        await delay(delayMs);
      }
    }

    // All attempts failed, handle error and throw
    throw handleApiError(lastError);
  }

  /**
   * HTTP Methods
   */
  async get<T = any>(url: string, config?: HttpServiceConfig): Promise<T> {
    return this.executeWithRetry(async () => {
      const { axiosConfig, cleanup } = this.setupRequest(config);

      try {
        const response = await this.axiosInstance.get<T>(url, axiosConfig);
        return response.data;
      } finally {
        cleanup();
      }
    }, config);
  }

  async post<T = any>(url: string, data?: any, config?: HttpServiceConfig): Promise<T> {
    return this.executeWithRetry(async () => {
      const { axiosConfig, cleanup } = this.setupRequest(config);

      try {
        const response = await this.axiosInstance.post<T>(url, data, axiosConfig);
        return response.data;
      } finally {
        cleanup();
      }
    }, config);
  }

  async put<T = any>(url: string, data?: any, config?: HttpServiceConfig): Promise<T> {
    return this.executeWithRetry(async () => {
      const { axiosConfig, cleanup } = this.setupRequest(config);

      try {
        const response = await this.axiosInstance.put<T>(url, data, axiosConfig);
        return response.data;
      } finally {
        cleanup();
      }
    }, config);
  }

  async patch<T = any>(url: string, data?: any, config?: HttpServiceConfig): Promise<T> {
    return this.executeWithRetry(async () => {
      const { axiosConfig, cleanup } = this.setupRequest(config);

      try {
        const response = await this.axiosInstance.patch<T>(url, data, axiosConfig);
        return response.data;
      } finally {
        cleanup();
      }
    }, config);
  }

  async delete<T = any>(url: string, config?: HttpServiceConfig): Promise<T> {
    return this.executeWithRetry(async () => {
      const { axiosConfig, cleanup } = this.setupRequest(config);

      try {
        const response = await this.axiosInstance.delete<T>(url, axiosConfig);
        return response.data;
      } finally {
        cleanup();
      }
    }, config);
  }

  async upload<T = any>(
    url: string,
    formData: FormData,
    config?: HttpServiceConfig & {
      onUploadProgress?: (progressEvent: any) => void;
    }
  ): Promise<T> {
    return this.executeWithRetry(async () => {
      const { onUploadProgress, ...baseConfig } = config || {};
      const { axiosConfig, cleanup } = this.setupRequest(baseConfig);

      try {
        const response = await this.axiosInstance.post<T>(url, formData, {
          ...axiosConfig,
          headers: {
            ...axiosConfig.headers,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress,
        });
        return response.data;
      } finally {
        cleanup();
      }
    }, config);
  }

  /**
   * Cancel pending request by ID
   */
  cancelRequest(requestId: string): void {
    const controller = this.pendingRequests.get(requestId);
    if (controller) {
      controller.abort();
      this.pendingRequests.delete(requestId);
    }
  }

  /**
   * Cancel all pending requests
   */
  cancelAllRequests(): void {
    this.pendingRequests.forEach((controller) => {
      controller.abort();
    });
    this.pendingRequests.clear();
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

/**
 * Hook for using API service with helper methods
 */
export function useApiService() {
  const request = async <T>(
    method: "get" | "post" | "put" | "delete" | "patch",
    url: string,
    dataOrParams?: Record<string, any>,
    config?: {
      skipAuth?: boolean;
      requestId?: string;
      retryCount?: number;
      retryDelay?: number;
    }
  ): Promise<T> => {
    const requestConfig: HttpServiceConfig = {
      skipAuth: config?.skipAuth,
      requestId: config?.requestId,
      retryCount: config?.retryCount,
      retryDelay: config?.retryDelay,
    };

    switch (method) {
      case "get":
        return httpService.get<T>(url, { params: dataOrParams, ...requestConfig });
      case "post":
        return httpService.post<T>(url, dataOrParams, requestConfig);
      case "put":
        return httpService.put<T>(url, dataOrParams, requestConfig);
      case "patch":
        return httpService.patch<T>(url, dataOrParams, requestConfig);
      case "delete":
        return httpService.delete<T>(url, requestConfig);
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  };

  return {
    get: <T>(
      url: string,
      params?: Record<string, any>,
      config?: {
        skipAuth?: boolean;
        requestId?: string;
        retryCount?: number;
        retryDelay?: number;
      }
    ): Promise<T> => request("get", url, params, config),
    post: <T>(
      url: string,
      data?: Record<string, any>,
      config?: {
        skipAuth?: boolean;
        requestId?: string;
        retryCount?: number;
        retryDelay?: number;
      }
    ): Promise<T> => request("post", url, data, config),
    put: <T>(
      url: string,
      data?: Record<string, any>,
      config?: {
        skipAuth?: boolean;
        requestId?: string;
        retryCount?: number;
        retryDelay?: number;
      }
    ): Promise<T> => request("put", url, data, config),
    patch: <T>(
      url: string,
      data?: Record<string, any>,
      config?: {
        skipAuth?: boolean;
        requestId?: string;
        retryCount?: number;
        retryDelay?: number;
      }
    ): Promise<T> => request("patch", url, data, config),
    delete: <T>(
      url: string,
      config?: {
        skipAuth?: boolean;
        requestId?: string;
        retryCount?: number;
        retryDelay?: number;
      }
    ): Promise<T> => request("delete", url, undefined, config),
    upload: <T>(
      url: string,
      formData: FormData,
      config?: {
        skipAuth?: boolean;
        requestId?: string;
        retryCount?: number;
        retryDelay?: number;
        onUploadProgress?: (progressEvent: any) => void;
      }
    ): Promise<T> => httpService.upload<T>(url, formData, config),
    cancelRequest: (requestId: string) => httpService.cancelRequest(requestId),
    cancelAllRequests: () => httpService.cancelAllRequests(),
    generateRequestId: () => generateRequestId(),
  };
}
