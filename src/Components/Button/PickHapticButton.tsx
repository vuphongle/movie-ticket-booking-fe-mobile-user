import { Platform, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Haptics } from "react-native-nitro-haptics";

const PickHapticButton = (props: TouchableOpacityProps) => {
  return (
    <TouchableOpacity
      {...props}
      onPressIn={(ev) => {
        if (Platform.OS === "ios") {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impact("light");
        }
        props.onPressIn?.(ev);
      }}
    />
  );
};
export { PickHapticButton };
