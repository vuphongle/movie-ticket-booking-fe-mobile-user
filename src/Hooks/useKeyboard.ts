import { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";

export const useKeyboard = () => {
  const [keyboardShown, setKeyboardShown] = useState(false);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(showEvent, () => {
      setKeyboardShown(true);
    });

    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardShown(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return { keyboardShown };
};
