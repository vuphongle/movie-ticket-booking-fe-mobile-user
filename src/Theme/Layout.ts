import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import { StyleSheet, ViewStyle } from "react-native";

export const layout = {
  col: {
    flexDirection: "column",
  },
  colReverse: {
    flexDirection: "column-reverse",
  },
  wrap: {
    flexWrap: "wrap",
  },
  row: {
    flexDirection: "row",
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  itemsCenter: {
    alignItems: "center",
  },
  itemsStart: {
    alignItems: "flex-start",
  },
  itemsStretch: {
    alignItems: "stretch",
  },
  itemsEnd: {
    alignItems: "flex-end",
  },
  justifyCenter: {
    justifyContent: "center",
  },
  justifyAround: {
    justifyContent: "space-around",
  },
  justifyBetween: {
    justifyContent: "space-between",
  },
  justifyEnd: {
    justifyContent: "flex-end",
  },
  justifyStart: {
    justifyContent: "flex-start",
  },
  alignSelfEnd: {
    alignSelf: "flex-end",
  },
  alignSelfStart: {
    alignSelf: "flex-start",
  },
  alignSelfCenter: {
    alignSelf: "center",
  },
  overflowHidden: {
    overflow: "hidden",
  },
  /* Sizes Layouts */
  flex_1: {
    flex: 1,
  },
  fullWidth: {
    width: "100%",
  },
  fullHeight: {
    height: "100%",
  },
  fill: {
    width: "100%",
    height: "100%",
  },
  width: {
    width,
  },
  height: {
    height,
  },
  fullDevice: {
    width,
    height,
  },
  imgBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  /* Positions */
  relative: {
    position: "relative",
  },
  absolute: {
    position: "absolute",
  },
  top0: {
    top: 0,
  },
  bottom0: {
    bottom: 0,
  },
  left0: {
    left: 0,
  },
  right0: {
    right: 0,
  },
  z1: {
    zIndex: 1,
  },
  z10: {
    zIndex: 10,
  },
  z999: {
    zIndex: 999,
  },
} as const satisfies Record<string, ViewStyle>;
