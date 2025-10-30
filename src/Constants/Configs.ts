import { QueryClient } from "@tanstack/react-query";

export const CONFIG = {
  APP_ENV: (process.env.APP_ENV as string) || "dev",
  API_BASE_URL: (process.env.API_BASE_URL as string) || "https://gocinema.io.vn/api",
} as const;

export const isDevelopment = CONFIG.APP_ENV === "dev";
export const isProduction = CONFIG.APP_ENV === "prod";

export const STORAGE_KEYS = {
  APP: {
    USER_PREFERENCES: "@gocinema:UserPreferencesKey",
    FAVORITE_MOVIES: "@gocinema:FavoriteMoviesKey",
    RECENT_SEARCHES: "@gocinema:RecentSearchesKey",
    BOOKING_DRAFT: "@gocinema:BookingDraftKey",
    SELECTED_CITY: "@gocinema:SelectedCityKey",
    LAST_LOGIN_EMAIL: "@gocinema:LastLoginEmailKey",
  },
  AUTH: {
    SERVICE_NAME: "GoCinemaAuth",
    TOKENS: {
      ACCESS_TOKEN: "accessToken",
      REFRESH_TOKEN: "refreshToken",
      TOKEN_EXPIRY: "tokenExpiry",
    },
  },
} as const;

export const QUERY_CONFIG = {
  // Default settings
  STALE_TIME: 60 * 1000, // 1 minute
  GC_TIME: 10 * 60 * 1000, // 10 minutes
  QUERIES_RETRY: 2,
  MUTATIONS_RETRY: 1,
  REFETCH_ON_WINDOW_FOCUS: false,
  REFETCH_ON_RECONNECT: true,
  NETWORK_MODE: "online" as const,

  // Specific query type configurations
  SEARCH: {
    STALE_TIME: 2 * 60 * 1000, // 2 minutes
    GC_TIME: 5 * 60 * 1000, // 5 minutes
    RETRY: 2,
  },

  PAGINATION: {
    STALE_TIME: 3 * 60 * 1000, // 3 minutes
    GC_TIME: 10 * 60 * 1000, // 10 minutes
    RETRY: 3,
  },

  STATIC: {
    STALE_TIME: 15 * 60 * 1000, // 15 minutes
    GC_TIME: 30 * 60 * 1000, // 30 minutes
    RETRY: 3,
  },
} as const;

export const queryClientConfig = {
  defaultOptions: {
    queries: {
      retry: QUERY_CONFIG.QUERIES_RETRY,
      staleTime: QUERY_CONFIG.STALE_TIME,
      gcTime: QUERY_CONFIG.GC_TIME,
      refetchOnWindowFocus: QUERY_CONFIG.REFETCH_ON_WINDOW_FOCUS,
      refetchOnReconnect: QUERY_CONFIG.REFETCH_ON_RECONNECT,
      networkMode: QUERY_CONFIG.NETWORK_MODE,
    },
    mutations: {
      retry: QUERY_CONFIG.MUTATIONS_RETRY,
      networkMode: QUERY_CONFIG.NETWORK_MODE,
    },
  },
};

export const makeQueryClient = (): QueryClient => {
  return new QueryClient(queryClientConfig);
};

let appQueryClient: QueryClient | undefined = undefined;

export const getQueryClient = (): QueryClient => {
  if (!appQueryClient) {
    appQueryClient = makeQueryClient();
  }
  return appQueryClient;
};

export const queryClient = getQueryClient();
