export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
  user: UserInfo | null;
  error: string | null;
  tokenType: string | null;
}

export interface UserInfo {
  sub: string;
  email: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  roles?: string[];
  preferred_username?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  accessTokenExpirationDate: string;
  tokenType: string;
  scopes: string[];
  registrationToken?: string;
  isRegistered?: boolean;
}

// Auth service interface
export interface AuthServiceInterface {
  login: () => Promise<AuthTokens>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<AuthTokens>;
  getUserInfo: (token: string) => UserInfo;
  getStoredTokens: () => Promise<AuthTokens | null>;
  clearStoredTokens: () => Promise<void>;
}
