import React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import RenderHtml from "react-native-render-html";
import type { ChatMessage } from "@Types/chatTypes";
import { ChatMovieCard } from "./ChatMovieCard";
import { PickView } from "@Components";

interface ChatMessageProps {
  message: ChatMessage;
  onMoviePress?: (movieId: string, slug: string) => void;
  onShowtimePress?: (movie: any, showtime: any) => void;
}

export const ChatMessageBubble: React.FC<ChatMessageProps> = ({
  message,
  onMoviePress,
  onShowtimePress,
}) => {
  const { width } = useWindowDimensions();
  const isAssistant = message.sender === "assistant";
  const isError = message.variant === "error";

  // Convert markdown-like text to simple HTML for rendering
  const htmlContent = message.content
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
    .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic
    .replace(/\n/g, "<br/>"); // Line breaks

  const tagsStyles = {
    body: {
      color: isAssistant ? "#333333" : "#ffffff",
      fontSize: 14,
      lineHeight: 20,
    },
    p: {
      marginBottom: 8,
    },
    strong: {
      fontWeight: "600" as const,
      color: isAssistant ? "#1a1a2e" : "#ffffff",
    },
    em: {
      fontStyle: "italic" as const,
    },
  };

  return (
    <PickView
      width={"100%"}
      paddingHorizontal={16}
      marginBottom={12}
      style={[isAssistant ? styles.assistantContainer : styles.userContainer]}
    >
      <PickView
        maxWidth={"92%"}
        paddingHorizontal={14}
        paddingVertical={12}
        borderRadius={16}
        shadowColor={"#000"}
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={8}
        elevation={3}
        style={[
          isAssistant ? styles.assistantBubble : styles.userBubble,
          isError && styles.errorBubble,
        ]}
      >
        <RenderHtml
          contentWidth={width * 0.92}
          source={{ html: htmlContent }}
          tagsStyles={tagsStyles}
        />

        {/* Render movie cards if available */}
        {isAssistant && message.movies && message.movies.length > 0 && (
          <PickView gap={12} marginTop={12}>
            {message.movies.map((movie) => (
              <ChatMovieCard
                key={movie.movieId}
                movie={movie}
                onPress={onMoviePress}
                onShowtimePress={onShowtimePress}
              />
            ))}
          </PickView>
        )}
      </PickView>
    </PickView>
  );
};

const styles = StyleSheet.create({
  assistantContainer: {
    alignItems: "flex-start",
  },
  userContainer: {
    alignItems: "flex-end",
  },
  assistantBubble: {
    backgroundColor: "#f5f5f5",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  userBubble: {
    backgroundColor: "#6366f1",
    borderBottomRightRadius: 4,
  },
  errorBubble: {
    backgroundColor: "#ffe6e6",
    borderWidth: 1,
    borderColor: "#ffcccc",
  },
});
