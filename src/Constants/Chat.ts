export const CHAT_STORAGE_KEYS = {
  GUEST_CONVERSATION: "@gocinema:chat_conversation_guest",
  USER_CONVERSATION_PREFIX: "@gocinema:chat_conversation_user_",
  GUEST_HISTORY: "@gocinema:chat_history_guest",
  USER_HISTORY_PREFIX: "@gocinema:chat_history_user_",
} as const;

export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 500,
  GREETING_MESSAGE:
    "Xin chào! Tôi là trợ lý AI của GoCinema. Tôi có thể giúp bạn tìm phim phù hợp với sở thích của bạn. Bạn đang tìm kiếm thể loại phim gì?",
  ERROR_MESSAGE: "Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.",
  INPUT_PLACEHOLDER: "Nhập tin nhắn...",
  SEND_BUTTON_LABEL: "Gửi",
  LOADING_TEXT: "Đang tìm kiếm...",
  RESET_CONFIRMATION: "Bạn có chắc muốn bắt đầu cuộc trò chuyện mới?",
} as const;

export const CHAT_QUERY_KEYS = {
  SEND_MESSAGE: "chat-send-message",
} as const;
