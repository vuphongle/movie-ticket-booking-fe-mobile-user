export const CHAT_STORAGE_KEYS = {
  GUEST_CONVERSATION: "@gocinema:chat_conversation_guest",
  USER_CONVERSATION_PREFIX: "@gocinema:chat_conversation_user_",
  GUEST_HISTORY: "@gocinema:chat_history_guest",
  USER_HISTORY_PREFIX: "@gocinema:chat_history_user_",
} as const;

export const CHAT_TEXT_KEYS = {
  GREETING: "CHAT_GREETING",
  ERROR: "CHAT_ERROR",
  INPUT_PLACEHOLDER: "CHAT_INPUT_PLACEHOLDER",
  SEND_BUTTON: "CHAT_SEND",
  LOADING: "CHAT_LOADING",
  RESET_CONFIRMATION: "CHAT_RESET_CONFIRMATION",
} as const;

export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 500,
} as const;

export const CHAT_QUERY_KEYS = {
  SEND_MESSAGE: "chat-send-message",
} as const;
