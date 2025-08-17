import React, { createContext, ReactNode } from "react";
import { Dimensions, Platform } from "react-native";

import { colorBackground } from "./Color/Background";
import { colorBorder } from "./Color/Border";
import { colorButton } from "./Color/Button";
import { colorIcon } from "./Color/Icon";
import { colorText } from "./Color/Text";
import { colorPrimary } from "./Color/Semantic";
import { radius } from "./Radius";
import { scale, verticalScale, h, w } from "./Scale";
import { spacing } from "./Spacing";
import { fontStyle } from "./TextStyles";
import { buttonSize } from "./ButtonStyles";
import { layout } from "./Layout";
import { gutters } from "./Gutters";

const { width, height } = Dimensions.get("window");

const defaultProvider = {
  fontStyle,
  spacing,
  radius,
  theme: "light",
  buttonSize,
  semantic: colorPrimary,
  layout,
  gutters,
  colors: {
    background: colorBackground.light,
    border: colorBorder.light,
    button: colorButton.light,
    icon: colorIcon.light,
    text: colorText.light,
  },
  dimensions: {
    width,
    height,
    platform: Platform.OS === "ios" ? true : false,
  },
  scale: (size: number) => size,
  verticalScale: (size: number) => size,
  w,
  h,
  toggleTheme: () => {},
};

const ThemeContext = createContext(defaultProvider);

type Props = {
  children: ReactNode;
  // font: any;
  // spacing: any;
  // radius: any;
  // theme: 'light';
  // colors: any;
  // scale: (size: number) => number;
  // verticalScale: (size: number) => number;
  // toggleTheme: () => void;
};

const ThemeProvider = ({ children }: Props) => {
  const [theme, setTheme] = React.useState("light");

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
  };

  const colors =
    theme === "light"
      ? {
          background: colorBackground.light,
          border: colorBorder.light,
          button: colorButton.light,
          icon: colorIcon.light,
          text: colorText.light,
        }
      : {
          background: colorBackground.dark,
          border: colorBorder.dark,
          button: colorButton.dark,
          icon: colorIcon.dark,
          text: colorText.dark,
        };

  const values = {
    fontStyle,
    spacing,
    colors,
    theme,
    radius,
    buttonSize,
    semantic: colorPrimary,
    layout,
    gutters,
    dimensions: {
      width,
      height,
      platform: Platform.OS === "ios" ? true : false,
    },
    scale,
    verticalScale,
    w,
    h,
    toggleTheme,
  };

  return <ThemeContext.Provider value={values}>{children}</ThemeContext.Provider>;
};

export { ThemeContext, ThemeProvider };
