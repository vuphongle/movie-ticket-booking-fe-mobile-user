import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = (size: number) => {
  "worklet";
  return (width / guidelineBaseWidth) * size;
};

const verticalScale = (size: number) => {
  "worklet";
  return (height / guidelineBaseHeight) * size;
};

const w = (value: number) => ({ width: scale(value) });
const h = (value: number) => ({ height: scale(value) });

export { scale, verticalScale, w, h };
