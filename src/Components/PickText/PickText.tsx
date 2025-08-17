import React from "react";
import { scale } from "@Theme/Scale";
import { fontStyle } from "@Theme/TextStyles";
import useThemedStyles from "@Theme/Hook/useThemedStyles";

import { Text as RNText, StyleProp, TextProps, TextStyle } from "react-native";
import Animated from "react-native-reanimated";

interface PickTextProps extends TextProps {
  /**
   * Overwrite style for text
   * @default undefined
   */
  style?: StyleProp<TextStyle>;
  size?: number;
  lineHeight?: number;
  textColor?: string;
  isAnimated?: boolean;
  underline?: boolean;
  align?: "left" | "center" | "right";
  color?:
    | "heading-primary"
    | "heading-secondary"
    | "placeholder"
    | "heading-inverted"
    | "body"
    | "body-inverted"
    | "body-on-brand"
    | "sub-headline-brand"
    | "footer-headline"
    | "footer-headline-inverted"
    | "disabled"
    | "error-primary"
    | "error-secondary";
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "sub_headline"
    | "body_large"
    | "body_small"
    | "caption_large"
    | "caption_small";
  font?:
    | "regular"
    | "medium"
    | "medium_italic"
    | "semibold"
    | "semibold_italic"
    | "italic"
    | "bold"
    | "bold_italic"
    | "extrabold"
    | "extrabold_italic";
  fontFamily?:
    | "Inter-Black"
    | "Inter-BlackItalic"
    | "Inter-Bold"
    | "Inter-BoldItalic"
    | "Inter-ExtraBold"
    | "Inter-ExtraBoldItalic"
    | "Inter-ExtraLight"
    | "Inter-ExtraLightItalic"
    | "Inter-Italic"
    | "Inter-Light"
    | "Inter-LightItalic"
    | "Inter-Medium"
    | "Inter-MediumItalic"
    | "Inter-Regular"
    | "Inter-SemiBold"
    | "Inter-SemiBoldItalic"
    | "Inter-Thin"
    | "Inter-ThinItalic";

  isTitle?: boolean;
}

const PickText = React.memo((props: PickTextProps) => {
  const { colors } = useThemedStyles();
  const {
    style,
    children,
    size,
    lineHeight,
    isAnimated = false,
    underline,
    align = "left",
    variant = "body_small",
    font = "regular",
    color = "body",
    fontFamily,
    accessibilityLabel,
    ...rest
  } = props;
  const TextComponent = isAnimated ? Animated.Text : RNText;

  const baseFontStyle = fontStyle?.[variant]?.[font] || {};

  const composedStyle = [
    baseFontStyle,
    { color: colors.text[color], textAlign: align },
    underline ? { textDecorationLine: "underline" as const } : null,
    lineHeight ? { lineHeight: scale(lineHeight) } : null,
    size ? { fontSize: scale(size) } : null,
    fontFamily ? { fontFamily } : null,
    style,
  ];

  return (
    <TextComponent
      allowFontScaling={false}
      accessibilityLabel={
        accessibilityLabel || (typeof children === "string" ? children : undefined)
      }
      {...rest}
      style={composedStyle}
    >
      {children}
    </TextComponent>
  );
});

export { PickText };
