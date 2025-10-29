/**
 * Error codes returned from API
 * Keep in sync with backend error codes
 */

export const ERROR_CODES = {
  // Authentication errors
  ACCOUNT_NOT_ACTIVATED: "ACCOUNT_NOT_ACTIVATED",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  UNAUTHORIZED: "UNAUTHORIZED",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",

  // General errors
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  SERVER_ERROR: "SERVER_ERROR",

  // Validation errors
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_INPUT: "INVALID_INPUT",
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;

/**
 * User-friendly error messages
 */
export const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.ACCOUNT_NOT_ACTIVATED]:
    "Tài khoản của bạn chưa được kích hoạt. Vui lòng kiểm tra email để nhận liên kết kích hoạt.",
  [ERROR_CODES.INVALID_CREDENTIALS]: "Email hoặc mật khẩu không hợp lệ. Vui lòng thử lại.",
  [ERROR_CODES.UNAUTHORIZED]: "Bạn không có quyền truy cập. Vui lòng đăng nhập lại.",
  [ERROR_CODES.TOKEN_EXPIRED]: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  [ERROR_CODES.NETWORK_ERROR]: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.",
  [ERROR_CODES.SERVER_ERROR]: "Lỗi máy chủ. Vui lòng thử lại sau.",
  [ERROR_CODES.UNKNOWN_ERROR]: "Đã xảy ra lỗi. Vui lòng thử lại.",
};

/**
 * Get user-friendly error message from error code
 */
export const getErrorMessage = (code?: string, defaultMessage?: string): string => {
  if (code && ERROR_MESSAGES[code]) {
    return ERROR_MESSAGES[code];
  }
  return defaultMessage || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR];
};
