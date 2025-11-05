import React from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { PickText, PickView } from "@Components";
import useThemedStyles from "@Theme/Hook/useThemedStyles";

interface ScreenHeaderProps {
  title?: string;
  backgroundColor?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  iconColor?: string;
  titleColor?:
    | "body"
    | "body-inverted"
    | "disabled"
    | "heading-primary"
    | "heading-secondary"
    | "placeholder"
    | "heading-inverted"
    | "body-on-brand"
    | "sub-headline-brand"
    | "footer-headline"
    | "footer-headline-inverted"
    | "error-primary"
    | "error-secondary";
  rightComponent?: React.ReactNode;
  withShadow?: boolean;
  paddingTop?: number;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  backgroundColor,
  showBackButton = true,
  onBackPress,
  iconColor,
  titleColor,
  rightComponent,
  withShadow = false,
  paddingTop,
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { colors } = useThemedStyles();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const finalIconColor = iconColor || (backgroundColor ? "#fff" : "#1a1a2e");

  const finalTitleColor = titleColor || (backgroundColor ? "body-inverted" : undefined);

  return (
    <PickView
      paddingHorizontal={20}
      paddingTop={paddingTop !== undefined ? paddingTop : insets.top}
      paddingBottom={16}
      backgroundColor={backgroundColor || colors.background["bg-primary"]}
      row
      alignCenter
      style={{
        justifyContent: "space-between",
        ...(withShadow && {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        }),
      }}
    >
      {/* Left: Back Button */}
      {showBackButton ? (
        <TouchableOpacity onPress={handleBackPress}>
          <PickView
            width={40}
            height={40}
            borderRadius={20}
            justifyCenter
            alignCenter
            backgroundColor={backgroundColor ? "rgba(255,255,255,0.2)" : undefined}
          >
            <Icon name="arrow-back" size={24} color={finalIconColor} />
          </PickView>
        </TouchableOpacity>
      ) : (
        <PickView width={40} />
      )}

      {/* Center: Title */}
      {title && (
        <PickText
          size={20}
          font="bold"
          color={finalTitleColor}
          align="center"
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{ flex: 1, marginHorizontal: 8 }}
        >
          {title}
        </PickText>
      )}

      {/* Right: Custom Component or Spacer */}
      {rightComponent || <PickView width={40} />}
    </PickView>
  );
};
