import { StyleSheet } from "react-native";
import { scale } from "./Scale";

export const SPACING = {
  none: 0,
  s1: 1,
  s2: 2,
  s3: 3,
  s4: 4,
  s6: 6,
  s8: 8,
  s10: 10,
  s12: 12,
  s14: 14,
  s16: 16,
  s20: 20,
  s22: 22,
  s24: 24,
  s26: 26,
  s28: 28,
  s30: 30,
  s32: 32,
  s34: 34,
  s36: 36,
  s38: 38,
  s40: 40,
  s42: 42,
  s44: 44,
  s46: 46,
  s48: 48,
  s50: 50,
  s52: 52,
  s54: 54,
  s56: 56,
  s58: 58,
  s60: 60,
  s62: 62,
  s64: 64,
  s66: 66,
  s68: 68,
  s70: 70,
  s72: 72,
  s80: 80,
  s88: 88,
  s96: 96,
  s112: 112,
  s128: 128,
  s144: 144,
  s160: 160,
  s192: 192,
  s208: 208,
  s224: 224,
  s240: 240,
  s256: 256,
  s288: 288,
  s320: 320,
  s384: 384,
};

const spacingStyles = Object.entries(SPACING).reduce<Record<string, object>>(
  (acc, [_key, size]) => {
    acc[`width_${size}`] = { width: scale(size) };
    acc[`height_${size}`] = { height: scale(size) };
    acc[`borderRadius_${size}`] = { borderRadius: scale(size) };
    acc[`borderWidth_${size}`] = { borderWidth: scale(size) };
    acc[`gap_${size}`] = { gap: scale(size) };
    acc[`top_${size}`] = { top: scale(size) };
    acc[`right_${size}`] = { right: scale(size) };
    acc[`left_${size}`] = { left: scale(size) };
    acc[`bottom_${size}`] = { bottom: scale(size) };

    // Margin
    acc[`margin_${size}`] = { margin: scale(size) };
    acc[`marginTop_${size}`] = { marginTop: scale(size) };
    acc[`marginBottom_${size}`] = { marginBottom: scale(size) };
    acc[`marginLeft_${size}`] = { marginLeft: scale(size) };
    acc[`marginRight_${size}`] = { marginRight: scale(size) };
    acc[`marginHorizontal_${size}`] = { marginHorizontal: scale(size) };
    acc[`marginVertical_${size}`] = { marginVertical: scale(size) };

    // Padding
    acc[`padding_${size}`] = { padding: scale(size) };
    acc[`paddingTop_${size}`] = { paddingTop: scale(size) };
    acc[`paddingBottom_${size}`] = { paddingBottom: scale(size) };
    acc[`paddingLeft_${size}`] = { paddingLeft: scale(size) };
    acc[`paddingRight_${size}`] = { paddingRight: scale(size) };
    acc[`paddingHorizontal_${size}`] = { paddingHorizontal: scale(size) };
    acc[`paddingVertical_${size}`] = { paddingVertical: scale(size) };

    return acc;
  },
  {}
);

export const gutters = StyleSheet.create(spacingStyles);
