const auth = {
  LOGIN: "/public/auth/login",
  REGISTER: "/public/auth/register",
  LOGOUT: "/auth/logout",
  REFRESH_TOKEN: "/auth/refresh",
} as const;

export default auth;
