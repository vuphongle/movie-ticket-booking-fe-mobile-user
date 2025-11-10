import auth from "./auth";
import user from "./user";
import chat from "./chat";

const endpoints = {
  AUTH: auth,
  USER: user,
  CHAT: chat,
} as const;

export default endpoints;
