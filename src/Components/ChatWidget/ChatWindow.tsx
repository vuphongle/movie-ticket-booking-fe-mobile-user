import React, { useState, useRef, useEffect } from "react";
import {
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useChat } from "@Hooks/useChat";
import { ChatMessageBubble } from "./ChatMessage";
import { CHAT_CONFIG } from "@Constants";
import { PickView, PickText, PickInput } from "@Components";
import type { RecommendedMovie, RecommendedShowtime } from "@Types/chatTypes";

interface ChatWindowProps {
  visible: boolean;
  onClose: () => void;
  onMoviePress?: (movieId: string, slug: string) => void;
  onShowtimePress?: (movie: RecommendedMovie, showtime: RecommendedShowtime) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  visible,
  onClose,
  onMoviePress,
  onShowtimePress,
}) => {
  const { messages, isLoading, sendMessage, resetConversation } = useChat();
  const [inputValue, setInputValue] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  /**
   * Animate modal slide in/out with opacity
   */
  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  /**
   * Auto scroll to bottom when new messages arrive
   */
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  /**
   * Handle send message
   */
  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) {
      return;
    }

    sendMessage(trimmed);
    setInputValue("");
  };

  /**
   * Handle reset conversation with confirmation
   */
  const handleReset = () => {
    Alert.alert("Bắt đầu cuộc trò chuyện mới", CHAT_CONFIG.RESET_CONFIRMATION, [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Xác nhận",
        style: "destructive",
        onPress: () => {
          resetConversation();
        },
      },
    ]);
  };

  return (
    <Modal visible={visible} animationType="none" transparent onRequestClose={onClose}>
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: slideAnim,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.container,
            {
              opacity: slideAnim,
              marginTop: insets.top,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Header */}
          <PickView
            row
            alignCenter
            justifySpaceBetween
            paddingHorizontal={20}
            paddingVertical={16}
            borderBottomWidth={1}
            style={{ borderBottomColor: "#e0e0e0" }}
          >
            <PickView flex={1}>
              <PickText size={18} style={{ fontWeight: "600", color: "#1a1a2e" }}>
                Trợ lý AI GoCinema
              </PickText>
              <PickText size={12} style={{ color: "#666666", marginTop: 2 }}>
                Tìm phim phù hợp với bạn
              </PickText>
            </PickView>
            <PickView row gap={8}>
              <TouchableOpacity style={styles.iconButton} onPress={handleReset} activeOpacity={0.7}>
                <Icon name="refresh" size={20} color="#1a1a2e" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={onClose} activeOpacity={0.7}>
                <Icon name="close" size={20} color="#1a1a2e" />
              </TouchableOpacity>
            </PickView>
          </PickView>

          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ChatMessageBubble
                message={item}
                onMoviePress={onMoviePress}
                onShowtimePress={onShowtimePress}
              />
            )}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }}
          />

          {/* Loading indicator */}
          {isLoading && (
            <PickView row alignCenter justifyCenter paddingVertical={12} gap={8}>
              <ActivityIndicator color="#6366f1" size="small" />
              <PickText size={12} style={{ color: "#666666" }}>
                {CHAT_CONFIG.LOADING_TEXT}
              </PickText>
            </PickView>
          )}

          {/* Input */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? insets.bottom + 20 : 0}
          >
            <PickView
              row
              alignCenter
              paddingHorizontal={16}
              paddingVertical={12}
              style={{
                borderTopWidth: 1,
                borderTopColor: "#e0e0e0",
                gap: 12,
              }}
            >
              <PickView flex={1}>
                <PickInput
                  placeholder={CHAT_CONFIG.INPUT_PLACEHOLDER}
                  placeholderTextColor="#999999"
                  value={inputValue}
                  onChangeText={setInputValue}
                  onSubmitEditing={handleSend}
                  editable={!isLoading}
                  maxLength={CHAT_CONFIG.MAX_MESSAGE_LENGTH}
                  containerStyle={{ marginBottom: 0 }}
                />
              </PickView>
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!inputValue.trim() || isLoading) && styles.sendButtonDisabled,
                ]}
                onPress={handleSend}
                disabled={!inputValue.trim() || isLoading}
                activeOpacity={0.7}
              >
                <Icon
                  name="send"
                  size={20}
                  color={!inputValue.trim() || isLoading ? "#999999" : "#ffffff"}
                />
              </TouchableOpacity>
            </PickView>
          </KeyboardAvoidingView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  safeContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    paddingBottom: Platform.OS === "ios" ? 20 : 0,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  messagesList: {
    paddingTop: 16,
    paddingBottom: 8,
    flexGrow: 1,
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#6366f1",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  sendButtonDisabled: {
    backgroundColor: "#e0e0e0",
  },
});
