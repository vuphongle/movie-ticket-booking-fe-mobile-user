export const ROOT_STACK = {
  MAIN: "Main",
} as const;

export const MAIN_TAB_STACK = {
  HOME: "Home",
  BOOKING: "Booking",
  NEWS: "News",
  PROFILE: "Profile",
} as const;

// Export all endpoints
export { default as endpoints } from "./Endpoints";

// Export configs
export {
  CONFIG,
  isDevelopment,
  isProduction,
  STORAGE_KEYS,
  QUERY_CONFIG,
  queryClientConfig,
  makeQueryClient,
  getQueryClient,
  queryClient,
} from "./Configs";

// Legacy exports
export * from "./theme";
export * from "./errorCodes";
export * from "./api";
export * from "./Chat";
