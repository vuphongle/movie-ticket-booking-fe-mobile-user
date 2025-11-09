import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
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
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useChat } from "@Hooks/useChat";
import { ChatMessageBubble } from "./ChatMessage";
import { CHAT_CONFIG } from "@Constants";

interface ChatWindowProps {
  visible: boolean;
  onClose: () => void;
  onMoviePress?: (movieId: string, slug: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ visible, onClose, onMoviePress }) => {
  const { messages, isLoading, sendMessage, resetConversation } = useChat();
  const [inputValue, setInputValue] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

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
        <SafeAreaView style={styles.safeContainer} edges={["top"]}>
          <Animated.View
            style={[
              styles.container,
              {
                opacity: slideAnim,
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
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.title}>Trợ lý AI GoCinema</Text>
                <Text style={styles.subtitle}>Tìm phim phù hợp với bạn</Text>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleReset}
                  activeOpacity={0.7}
                >
                  <Icon name="refresh" size={20} color="#f1f5f9" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={onClose} activeOpacity={0.7}>
                  <Icon name="close" size={20} color="#f1f5f9" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Messages */}
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ChatMessageBubble message={item} onMoviePress={onMoviePress} />
              )}
              contentContainerStyle={styles.messagesList}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => {
                flatListRef.current?.scrollToEnd({ animated: true });
              }}
            />

            {/* Loading indicator */}
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#60a5fa" size="small" />
                <Text style={styles.loadingText}>{CHAT_CONFIG.LOADING_TEXT}</Text>
              </View>
            )}

            {/* Input */}
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              keyboardVerticalOffset={0}
            >
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder={CHAT_CONFIG.INPUT_PLACEHOLDER}
                  placeholderTextColor="rgba(148, 163, 184, 0.7)"
                  value={inputValue}
                  onChangeText={setInputValue}
                  onSubmitEditing={handleSend}
                  editable={!isLoading}
                  maxLength={CHAT_CONFIG.MAX_MESSAGE_LENGTH}
                  multiline
                  numberOfLines={3}
                />
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
                    color={!inputValue.trim() || isLoading ? "#94a3b8" : "#f8fafc"}
                  />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </Animated.View>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  safeContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.98)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    paddingBottom: Platform.OS === "ios" ? 20 : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#f8fafc",
  },
  subtitle: {
    fontSize: 12,
    color: "rgba(226, 232, 240, 0.7)",
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(148, 163, 184, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  messagesList: {
    paddingTop: 16,
    paddingBottom: 8,
    flexGrow: 1,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    color: "rgba(226, 232, 240, 0.8)",
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#e2e8f0",
    maxHeight: 100,
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: "rgba(96, 165, 250, 0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "rgba(148, 163, 184, 0.3)",
  },
});
