import React from "react";
import { TouchableOpacityProps } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { PickHapticButton } from "./PickHapticButton";

interface ScalableButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
}

/**
 * A button component that provides scaling animation feedback on press
 * @param {React.ReactNode} props.children - The content to be rendered inside the button
 * @param {Function} [props.onPress] - Callback function when button is pressed
 * @param {Function} [props.onLongPress] - Callback function when button is long pressed
 * @param {Function} [props.onPressIn] - Callback function when press starts
 * @param {Function} [props.onPressOut] - Callback function when press ends
 * @param {Object} [props.style] - Additional styles for the button
 * @returns {React.ReactElement} A scalable animated button component
 */
const ScalableButton = (props: ScalableButtonProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = (isLongPress: boolean) => {
    scale.value = withTiming(isLongPress ? 0.8 : 0.9, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };

  return (
    <PickHapticButton
      onPressIn={() => handlePressIn(false)}
      onLongPress={() => handlePressIn(true)}
      onPressOut={handlePressOut}
      {...props}
    >
      <Animated.View style={[animatedStyle]}>{props.children}</Animated.View>
    </PickHapticButton>
  );
};

export { ScalableButton };
