import auth from "./auth";
import user from "./user";

const endpoints = {
  AUTH: auth,
  USER: user,
} as const;

export default endpoints;
