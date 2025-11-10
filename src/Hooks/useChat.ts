import { useState, useEffect, useCallback, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@Contexts/AuthContext";
import { chatService } from "@Services";
import { CHAT_STORAGE_KEYS, CHAT_CONFIG } from "@Constants";
import type {
  ChatMessage,
  ChatRecommendationRequest,
  ChatRecommendationResponse,
  ConversationHistory,
} from "@Types/chatTypes";

/**
 * Generate unique ID for messages
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
};

/**
 * Create greeting message
 */
const createGreetingMessage = (): ChatMessage => ({
  id: generateId(),
  sender: "assistant",
  content: CHAT_CONFIG.GREETING_MESSAGE,
  timestamp: Date.now(),
});

/**
 * Get storage keys based on user status
 */
const getStorageKeys = (userId?: string | null) => {
  if (userId) {
    return {
      conversationId: `${CHAT_STORAGE_KEYS.USER_CONVERSATION_PREFIX}${userId}`,
      history: `${CHAT_STORAGE_KEYS.USER_HISTORY_PREFIX}${userId}`,
    };
  }
  return {
    conversationId: CHAT_STORAGE_KEYS.GUEST_CONVERSATION,
    history: CHAT_STORAGE_KEYS.GUEST_HISTORY,
  };
};

/**
 * Persist conversation ID to AsyncStorage
 */
const persistConversationId = async (storageKey: string, conversationId: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(storageKey, conversationId);
  } catch (error) {
    if (__DEV__) {
      console.error("Failed to persist conversationId:", error);
    }
  }
};

/**
 * Load conversation ID from AsyncStorage
 */
const loadConversationId = async (storageKey: string): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(storageKey);
  } catch (error) {
    if (__DEV__) {
      console.error("Failed to load conversationId:", error);
    }
    return null;
  }
};

/**
 * Persist chat history to AsyncStorage
 */
const persistChatHistory = async (storageKey: string, messages: ChatMessage[]): Promise<void> => {
  try {
    const history: ConversationHistory = {
      conversationId: "", // Will be set by the hook
      messages,
      lastUpdated: Date.now(),
    };
    await AsyncStorage.setItem(storageKey, JSON.stringify(history));
  } catch (error) {
    if (__DEV__) {
      console.error("Failed to persist chat history:", error);
    }
  }
};

/**
 * Load chat history from AsyncStorage
 */
const loadChatHistory = async (storageKey: string): Promise<ChatMessage[]> => {
  try {
    const raw = await AsyncStorage.getItem(storageKey);
    if (raw) {
      const history = JSON.parse(raw) as ConversationHistory;
      return history.messages || [];
    }
  } catch (error) {
    if (__DEV__) {
      console.error("Failed to load chat history:", error);
    }
  }
  return [];
};

/**
 * Clear chat history from AsyncStorage
 */
const clearChatHistory = async (conversationKey: string, historyKey: string): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([conversationKey, historyKey]);
  } catch (error) {
    if (__DEV__) {
      console.error("Failed to clear chat history:", error);
    }
  }
};

/**
 * useChat Hook
 * Manages chatbot conversation state and API calls
 */
export const useChat = () => {
  const { state: authState } = useAuth();
  const userId = authState.user?.sub ?? null;

  const storageKeys = useMemo(() => getStorageKeys(userId), [userId]);

  const [conversationId, setConversationId] = useState<string | undefined>();
  const [messages, setMessages] = useState<ChatMessage[]>([createGreetingMessage()]);
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * Initialize conversation from AsyncStorage
   */
  useEffect(() => {
    const initialize = async () => {
      try {
        // Load conversation ID
        const savedConversationId = await loadConversationId(storageKeys.conversationId);
        if (savedConversationId) {
          setConversationId(savedConversationId);
        }

        // Load chat history
        const savedMessages = await loadChatHistory(storageKeys.history);
        if (savedMessages.length > 0) {
          setMessages(savedMessages);
        }
      } catch (error) {
        if (__DEV__) {
          console.error("Failed to initialize chat:", error);
        }
      } finally {
        setIsInitialized(true);
      }
    };

    initialize();
  }, [storageKeys]);

  /**
   * Persist messages whenever they change (after initialization)
   */
  useEffect(() => {
    if (isInitialized && messages.length > 0) {
      persistChatHistory(storageKeys.history, messages);
    }
  }, [messages, isInitialized, storageKeys.history]);

  /**
   * React Query mutation for sending messages
   */
  const mutation = useMutation({
    mutationFn: async (request: ChatRecommendationRequest) => {
      return await chatService.getRecommendations(request);
    },
    onSuccess: (response: ChatRecommendationResponse) => {
      // Update conversation ID if changed
      if (response.conversationId && response.conversationId !== conversationId) {
        setConversationId(response.conversationId);
        persistConversationId(storageKeys.conversationId, response.conversationId);
      }

      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: generateId(),
        sender: "assistant",
        content: response.answer,
        movies: response.recommendedMovies ?? [],
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    },
    onError: () => {
      // Add error message
      const errorMessage: ChatMessage = {
        id: generateId(),
        sender: "assistant",
        content: CHAT_CONFIG.ERROR_MESSAGE,
        variant: "error",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    },
  });

  /**
   * Send a message to the chatbot
   */
  const sendMessage = useCallback(
    async (messageText: string) => {
      const trimmed = messageText.trim();
      if (!trimmed || mutation.isPending) {
        return;
      }

      // Add user message
      const userMessage: ChatMessage = {
        id: generateId(),
        sender: "user",
        content: trimmed,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // Send to API
      const request: ChatRecommendationRequest = {
        message: trimmed,
        language: "vi", // Vietnamese
        conversationId: conversationId,
      };

      mutation.mutate(request);
    },
    [conversationId, mutation]
  );

  /**
   * Reset conversation (start new chat)
   */
  const resetConversation = useCallback(async () => {
    try {
      // Clear AsyncStorage
      await clearChatHistory(storageKeys.conversationId, storageKeys.history);

      // Reset state
      setConversationId(undefined);
      setMessages([createGreetingMessage()]);
    } catch (error) {
      if (__DEV__) {
        console.error("Failed to reset conversation:", error);
      }
    }
  }, [storageKeys]);

  return {
    messages,
    conversationId,
    isLoading: mutation.isPending,
    isInitialized,
    sendMessage,
    resetConversation,
  };
};
