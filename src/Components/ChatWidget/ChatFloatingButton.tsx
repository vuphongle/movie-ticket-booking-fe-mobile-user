import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Dimensions, Platform, TouchableOpacity } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BUTTON_SIZE = 56;
const PADDING = 24;

interface ChatFloatingButtonProps {
  onPress: () => void;
}

export const ChatFloatingButton: React.FC<ChatFloatingButtonProps> = ({ onPress }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Position tracking
  const translateX = useRef(new Animated.Value(SCREEN_WIDTH - BUTTON_SIZE - PADDING)).current;
  const translateY = useRef(
    new Animated.Value(SCREEN_HEIGHT - BUTTON_SIZE - PADDING - 100)
  ).current;

  const savedPosition = useRef({
    x: SCREEN_WIDTH - BUTTON_SIZE - PADDING,
    y: SCREEN_HEIGHT - BUTTON_SIZE - PADDING - 100,
  });

  const isDragging = useRef(false);

  /**
   * Pulse animation loop
   */
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [pulseAnim]);

  /**
   * Pan gesture handler
   */
  const panGesture = Gesture.Pan()
    .onStart(() => {
      isDragging.current = false;
    })
    .onUpdate((event) => {
      // Update position during drag
      const newX = savedPosition.current.x + event.translationX;
      const newY = savedPosition.current.y + event.translationY;

      // Boundaries
      const minX = PADDING;
      const maxX = SCREEN_WIDTH - BUTTON_SIZE - PADDING;
      const minY = PADDING + (Platform.OS === "ios" ? 50 : 20);
      const maxY = SCREEN_HEIGHT - BUTTON_SIZE - PADDING - 100;

      // Clamp and update
      translateX.setValue(Math.max(minX, Math.min(maxX, newX)));
      translateY.setValue(Math.max(minY, Math.min(maxY, newY)));

      // Mark as dragging if moved more than 10px
      const totalMovement = Math.sqrt(
        event.translationX * event.translationX + event.translationY * event.translationY
      );
      if (totalMovement > 10) {
        isDragging.current = true;
      }
    })
    .onEnd((event) => {
      // Calculate total movement
      const totalMovement = Math.sqrt(
        event.translationX * event.translationX + event.translationY * event.translationY
      );

      // If movement is less than 10, it's a tap
      if (totalMovement < 10) {
        onPress();
        isDragging.current = false;
        return;
      }

      // Save final position after drag
      const newX = savedPosition.current.x + event.translationX;
      const newY = savedPosition.current.y + event.translationY;

      // Boundaries
      const minX = PADDING;
      const maxX = SCREEN_WIDTH - BUTTON_SIZE - PADDING;
      const minY = PADDING + (Platform.OS === "ios" ? 50 : 20);
      const maxY = SCREEN_HEIGHT - BUTTON_SIZE - PADDING - 100;

      // Clamp and save
      savedPosition.current.x = Math.max(minX, Math.min(maxX, newX));
      savedPosition.current.y = Math.max(minY, Math.min(maxY, newY));

      isDragging.current = false;
    });

  if (__DEV__) {
    console.log("ChatFloatingButton render - Screen:", SCREEN_WIDTH, "x", SCREEN_HEIGHT);
    console.log("ChatFloatingButton initial:", savedPosition.current);
  }

  /**
   * Handle tap on button (when not dragging)
   */
  const handlePress = () => {
    if (!isDragging.current) {
      onPress();
    }
  };

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateX }, { translateY }, { scale: pulseAnim }],
          },
        ]}
      >
        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={handlePress}>
          <Icon name="robot" size={26} color="#0f172a" />
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    zIndex: 1000,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: "#f8c102",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
