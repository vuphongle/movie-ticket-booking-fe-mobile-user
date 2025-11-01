import React, { createContext, useContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthState, AuthTokens, UserInfo } from "@Types/authTypes";

const STORAGE_KEYS = {
  ACCESS_TOKEN: "@gocinema:accessToken",
  REFRESH_TOKEN: "@gocinema:refreshToken",
  ID_TOKEN: "@gocinema:idToken",
  TOKEN_TYPE: "@gocinema:tokenType",
  USER_INFO: "@gocinema:userInfo",
};

interface AuthProviderProps {
  children: React.ReactNode;
  onAuthNavigationRequired?: () => void;
}

// Auth reducer actions
type AuthAction =
  | { type: "AUTH_LOADING"; payload: boolean }
  | { type: "AUTH_SUCCESS"; payload: { tokens: AuthTokens; user: UserInfo } }
  | { type: "AUTH_ERROR"; payload: string }
  | { type: "AUTH_LOGOUT" }
  | { type: "CLEAR_ERROR" }
  | { type: "UPDATE_USER"; payload: UserInfo };

// Initial state
const initialState: AuthState = {
  isLoading: true,
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  user: null,
  error: null,
  idToken: null,
  tokenType: null,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_LOADING":
      return { ...state, isLoading: action.payload, error: null };
    case "AUTH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        accessToken: action.payload.tokens.accessToken,
        refreshToken: action.payload.tokens.refreshToken,
        idToken: action.payload.tokens.idToken,
        user: action.payload.user,
        error: null,
        tokenType: action.payload.tokens.tokenType,
      };
    case "AUTH_ERROR":
      return { ...state, isLoading: false, isAuthenticated: false, error: action.payload };
    case "AUTH_LOGOUT":
      return { ...initialState, isLoading: false };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "UPDATE_USER":
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

// Context type
interface AuthContextType {
  state: AuthState;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  clearError: () => void;
  checkAuthStatus: () => Promise<void>;
  updateAuthStatus: (tokens: AuthTokens, user: UserInfo) => Promise<void>;
  updateUser: (user: UserInfo) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      dispatch({ type: "AUTH_LOADING", payload: true });

      // Read stored tokens and user info
      const [accessToken, refreshToken, idToken, tokenType, userInfoStr] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.ID_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.TOKEN_TYPE),
        AsyncStorage.getItem(STORAGE_KEYS.USER_INFO),
      ]);

      if (accessToken && userInfoStr) {
        const user = JSON.parse(userInfoStr) as UserInfo;
        const tokens: AuthTokens = {
          accessToken,
          refreshToken: refreshToken || "",
          idToken: idToken || "",
          tokenType: tokenType || "Bearer",
          accessTokenExpirationDate: "",
          scopes: [],
        };

        dispatch({ type: "AUTH_SUCCESS", payload: { tokens, user } });
      } else {
        dispatch({ type: "AUTH_LOGOUT" });
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      dispatch({ type: "AUTH_LOGOUT" });
    }
  };

  const updateAuthStatus = async (tokens: AuthTokens, user: UserInfo) => {
    try {
      // Update state first (optimistic update)
      dispatch({ type: "AUTH_SUCCESS", payload: { tokens, user } });

      // Then save to AsyncStorage
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken),
        AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken || ""),
        AsyncStorage.setItem(STORAGE_KEYS.ID_TOKEN, tokens.idToken || ""),
        AsyncStorage.setItem(STORAGE_KEYS.TOKEN_TYPE, tokens.tokenType || "Bearer"),
        AsyncStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user)),
      ]);
    } catch (error) {
      console.error("Error saving auth data:", error);
      // Rollback state if save fails
      dispatch({ type: "AUTH_LOGOUT" });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.ID_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.TOKEN_TYPE),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_INFO),
      ]);

      dispatch({ type: "AUTH_LOGOUT" });
    } catch (error) {
      console.error("Error during logout:", error);
      dispatch({ type: "AUTH_LOGOUT" });
    }
  };

  const refreshTokens = async () => {
    // Tùy bạn implement, hiện chỉ clear để tránh lỗi
    dispatch({ type: "AUTH_ERROR", payload: "refreshTokens not implemented" });
    await logout();
  };

  const clearError = () => dispatch({ type: "CLEAR_ERROR" });

  /**
   * Update user info in state and AsyncStorage
   * Used after profile update
   */
  const updateUser = async (user: UserInfo) => {
    try {
      // Update state first (optimistic update)
      dispatch({ type: "UPDATE_USER", payload: user });

      // Then persist to AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user));
    } catch (error) {
      console.error("Error updating user info:", error);
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    state,
    logout,
    refreshTokens,
    clearError,
    checkAuthStatus,
    updateAuthStatus,
    updateUser,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
