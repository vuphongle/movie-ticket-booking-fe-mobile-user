import React, { createContext, useContext, useReducer, useEffect } from "react";
import { AuthState, AuthTokens, UserInfo } from "@Types/authTypes";

// Props for AuthProvider
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
  | { type: "CLEAR_ERROR" };

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
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // fake check status
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    dispatch({ type: "AUTH_LOADING", payload: true });
    // Ở đây bạn có thể thêm logic đọc token từ AsyncStorage
    dispatch({ type: "AUTH_LOGOUT" });
  };

  const updateAuthStatus = async (tokens: AuthTokens, user: UserInfo) => {
    dispatch({ type: "AUTH_SUCCESS", payload: { tokens, user } });
  };

  const logout = async () => {
    dispatch({ type: "AUTH_LOGOUT" });
  };

  const refreshTokens = async () => {
    // Tùy bạn implement, hiện chỉ clear để tránh lỗi
    dispatch({ type: "AUTH_ERROR", payload: "refreshTokens not implemented" });
    await logout();
  };

  const clearError = () => dispatch({ type: "CLEAR_ERROR" });

  const contextValue: AuthContextType = {
    state,
    logout,
    refreshTokens,
    clearError,
    checkAuthStatus,
    updateAuthStatus,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
