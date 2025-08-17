import React, { ReactNode, forwardRef, useMemo } from "react";
import { View as RNView, StyleProp, LayoutChangeEvent } from "react-native";
import type { ViewStyle } from "react-native";

export type LayoutProps = Partial<ViewStyle>;

export type ViewProps = {
  row?: boolean;
  alignCenter?: boolean;
  justifyCenter?: boolean;
  justifySpaceAround?: boolean;
  justifySpaceBetween?: boolean;
  justifyEnd?: boolean;
  centerSelf?: boolean;
  centerItems?: boolean;
  alignEnd?: boolean;
  alignStart?: boolean;
  opacity?: number;
  style?: StyleProp<ViewStyle>;
  onLayout?: (event: LayoutChangeEvent) => void;
  children?: ReactNode;
  borderTopRadius?: number;
  borderBottomRadius?: number;
  borderRightRadius?: number;
  borderLeftRadius?: number;
  backgroundColor?: string;
};

type Props = ViewProps & LayoutProps;

export const PickView = forwardRef<RNView, Props>((props, ref) => {
  const {
    row,
    alignCenter,
    justifyCenter,
    centerSelf,
    centerItems,
    onLayout,
    justifySpaceAround,
    justifySpaceBetween,
    justifyEnd,
    alignEnd,
    alignStart,
    style,
    flex,
    alignSelf,
    opacity,
    children,
    borderTopRadius = 0,
    borderBottomRadius = 0,
    borderRightRadius = 0,
    borderLeftRadius = 0,
    backgroundColor,
    ...otherProps
  } = props;

  const radiusStyle: ViewStyle = useMemo(
    () => ({
      ...(borderTopRadius > 0 && {
        borderTopLeftRadius: borderTopRadius,
        borderTopRightRadius: borderTopRadius,
      }),
      ...(borderBottomRadius > 0 && {
        borderBottomLeftRadius: borderBottomRadius,
        borderBottomRightRadius: borderBottomRadius,
      }),
      ...(borderRightRadius > 0 && {
        borderTopRightRadius: borderRightRadius,
        borderBottomRightRadius: borderRightRadius,
      }),
      ...(borderLeftRadius > 0 && {
        borderTopLeftRadius: borderLeftRadius,
        borderBottomLeftRadius: borderLeftRadius,
      }),
    }),
    [borderTopRadius, borderBottomRadius, borderRightRadius, borderLeftRadius]
  );

  const combinedStyle: ViewStyle = useMemo(
    () => ({
      flexDirection: row ? "row" : "column",
      ...(typeof flex === "number" ? { flex: flex > 1 ? flex : 1 } : {}),
      ...(alignSelf || centerSelf ? { alignSelf: "center" } : {}),
      ...(centerItems || alignCenter
        ? { alignItems: "center" }
        : alignEnd
        ? { alignItems: "flex-end" }
        : alignStart
        ? { alignItems: "flex-start" }
        : {}),
      ...(centerItems || justifyCenter
        ? { justifyContent: "center" }
        : justifySpaceAround
        ? { justifyContent: "space-around" }
        : justifySpaceBetween
        ? { justifyContent: "space-between" }
        : justifyEnd
        ? { justifyContent: "flex-end" }
        : {}),
      ...(typeof opacity === "number" ? { opacity } : {}),
      ...(backgroundColor ? { backgroundColor } : { backgroundColor: "transparent" }),
    }),
    [
      row,
      flex,
      alignSelf,
      centerSelf,
      centerItems,
      alignCenter,
      alignEnd,
      alignStart,
      justifyCenter,
      justifySpaceAround,
      justifySpaceBetween,
      justifyEnd,
      opacity,
      backgroundColor,
    ]
  );

  return (
    <RNView
      ref={ref}
      onLayout={onLayout}
      style={[radiusStyle, combinedStyle, style]}
      {...otherProps}
    >
      {children}
    </RNView>
  );
});

PickView.displayName = "View";
