import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import type { RootStackNavigationProp } from "@Types/navigationTypes";
import { ChatFloatingButton } from "./ChatFloatingButton";
import { ChatWindow } from "./ChatWindow";

/**
 * ChatWidget Component
 * Main component that combines floating button and chat window
 * This should be rendered at the root level (App.tsx or RootNavigator)
 */
export const ChatWidget: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigation = useNavigation<RootStackNavigationProp>();

  const handleOpen = () => {
    setIsVisible(true);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleMoviePress = (movieId: string, slug: string) => {
    // Close chat window first
    setIsVisible(false);

    // Navigate after a short delay to allow modal animation
    setTimeout(() => {
      navigation.navigate("MovieDetail", { id: movieId, slug });
    }, 300);
  };

  return (
    <GestureHandlerRootView style={styles.container} pointerEvents="box-none">
      <ChatFloatingButton onPress={handleOpen} />
      <ChatWindow visible={isVisible} onClose={handleClose} onMoviePress={handleMoviePress} />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
});
