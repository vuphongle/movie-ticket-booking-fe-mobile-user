import { i18n } from "@Locales/i18n";

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
  USER_NOT_FOUND: "USER_NOT_FOUND",
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;

/**
 * User-friendly error messages
 */

export const ERROR_MESSAGE_KEYS: Record<string, string> = {
  [ERROR_CODES.ACCOUNT_NOT_ACTIVATED]: "ERROR_ACCOUNT_NOT_ACTIVATED",
  [ERROR_CODES.INVALID_CREDENTIALS]: "ERROR_INVALID_CREDENTIALS",
  [ERROR_CODES.UNAUTHORIZED]: "ERROR_UNAUTHORIZED",
  [ERROR_CODES.TOKEN_EXPIRED]: "ERROR_TOKEN_EXPIRED",
  [ERROR_CODES.NETWORK_ERROR]: "ERROR_NETWORK",
  [ERROR_CODES.SERVER_ERROR]: "ERROR_SERVER",
  [ERROR_CODES.UNKNOWN_ERROR]: "ERROR_UNKNOWN",
  [ERROR_CODES.USER_NOT_FOUND]: "ERROR_USER_NOT_FOUND",
};

/**
 * Get user-friendly error message from error code
 */
export const getErrorMessage = (code?: string, defaultMessage?: string): string => {
  if (code && ERROR_MESSAGE_KEYS[code]) {
    return i18n.t(ERROR_MESSAGE_KEYS[code]);
  }
  if (defaultMessage) {
    return defaultMessage;
  }
  return i18n.t(ERROR_MESSAGE_KEYS[ERROR_CODES.UNKNOWN_ERROR]);
};
