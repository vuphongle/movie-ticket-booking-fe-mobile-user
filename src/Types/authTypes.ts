// Login API Types - Synced with backend User entity
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  dob: string; // ISO date string from backend
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  dob: Date;
}

export interface UpdateProfileRequest {
  name: string;
  phone: string;
  dob: string; // ISO date string (YYYY-MM-DD)
  avatar?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UploadResponse {
  url: string;
  filename: string | null;
  size: number;
  contentType: string | null;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

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
  avatar?: string;
  roles?: string[];
  preferred_username?: string;
  phone?: string;
  dob?: string; // ISO date string (YYYY-MM-DD)
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
