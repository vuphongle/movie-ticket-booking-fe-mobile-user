const auth = {
  LOGIN: "/public/auth/login",
  REGISTER: "/public/auth/register",
  FORGOT_PASSWORD: "/public/auth/forgot-password",
  LOGOUT: "/auth/logout",
  REFRESH_TOKEN: "/auth/refresh",
} as const;

export default auth;
