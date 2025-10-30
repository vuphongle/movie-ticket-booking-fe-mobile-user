/**
 * Standard API Error structure
 */
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
  originalError?: any;
}

/**
 * Extract meaningful error message from API response
 */
export function extractErrorMessage(error: any): string {
  // Try different message sources in order of preference
  const sources = [
    error.response?.data?.error?.message,
    error.response?.data?.message,
    error.response?.data?.error,
    error.response?.data?.error_description,
    error.message,
    typeof error.response?.data === "string" ? error.response.data : null,
  ];

  for (const source of sources) {
    if (source && typeof source === "string" && source.trim()) {
      return source.trim();
    }
  }

  return "An unexpected error occurred.";
}

/**
 * Handle API error - Extract message, log, and return enhanced error
 */
export function handleApiError(error: any): Error & ApiError {
  const message = extractErrorMessage(error);
  const status = error.response?.status;

  // Log in development
  if (__DEV__) {
    console.log(`🚨 API Error [${status}]:`, message);
    console.log("Full error:", error);
  }

  // Create and return enhanced error
  const errorDetail = new Error(message) as Error & ApiError;
  errorDetail.message = message;
  errorDetail.status = status;

  // Extract error code and details
  const errorData = error.response?.data?.error || error.response?.data;
  errorDetail.code = errorData?.code || error.response?.data?.code;
  errorDetail.details = errorData?.details || error.response?.data?.details;
  errorDetail.originalError = error;

  return errorDetail;
}
