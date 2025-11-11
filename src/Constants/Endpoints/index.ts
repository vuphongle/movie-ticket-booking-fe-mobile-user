import auth from "./auth";
import user from "./user";
import chat from "./chat";
import order from "./order";

const endpoints = {
  AUTH: auth,
  USER: user,
  CHAT: chat,
  ORDER: order,
} as const;

export default endpoints;
