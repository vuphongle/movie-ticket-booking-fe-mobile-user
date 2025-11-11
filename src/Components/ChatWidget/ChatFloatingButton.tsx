import React, { useEffect } from "react";
import { StyleSheet, Dimensions, Platform, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BUTTON_SIZE = 56;
const PADDING = 24;

interface ChatFloatingButtonProps {
  onPress: () => void;
}

export const ChatFloatingButton: React.FC<ChatFloatingButtonProps> = ({ onPress }) => {
  const scale = useSharedValue(1);

  const translateX = useSharedValue(SCREEN_WIDTH - BUTTON_SIZE - PADDING);
  const translateY = useSharedValue(SCREEN_HEIGHT - BUTTON_SIZE - PADDING - 100);

  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const isDragging = useSharedValue(false);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(withTiming(1.1, { duration: 1000 }), withTiming(1, { duration: 1000 })),
      -1,
      false
    );
  }, [scale]);

  /**
   * Pan gesture handler
   */
  const panGesture = Gesture.Pan()
    .onStart(() => {
      isDragging.value = false;
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      "worklet";
      const newX = startX.value + event.translationX;
      const newY = startY.value + event.translationY;

      // Boundaries
      const minX = PADDING;
      const maxX = SCREEN_WIDTH - BUTTON_SIZE - PADDING;
      const minY = PADDING + (Platform.OS === "ios" ? 50 : 20);
      const maxY = SCREEN_HEIGHT - BUTTON_SIZE - PADDING - 100;

      // Clamp and update
      translateX.value = Math.max(minX, Math.min(maxX, newX));
      translateY.value = Math.max(minY, Math.min(maxY, newY));

      // Mark as dragging if moved more than 10px
      const totalMovement = Math.sqrt(
        event.translationX * event.translationX + event.translationY * event.translationY
      );
      if (totalMovement > 10) {
        isDragging.value = true;
      }
    })
    .onEnd((event) => {
      "worklet";
      // Calculate total movement
      const totalMovement = Math.sqrt(
        event.translationX * event.translationX + event.translationY * event.translationY
      );

      // If movement is less than 10, it's a tap
      if (totalMovement < 10) {
        isDragging.value = false;
        return;
      }

      isDragging.value = false;
    });

  /**
   * Handle tap on button (when not dragging)
   */
  const handlePress = () => {
    if (!isDragging.value) {
      onPress();
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, animatedStyle]} pointerEvents="auto">
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
