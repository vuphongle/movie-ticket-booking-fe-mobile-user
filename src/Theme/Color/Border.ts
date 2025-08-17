import { colorPrimary } from "./Semantic";

export const colorBorderLight = {
  "border-primary": colorPrimary.Neutral["neutral/300"],
  "border-secondary": colorPrimary.Neutral["neutral/200"],
  "border-tertiary": colorPrimary.Neutral["neutral/100"],
  "border-disabled": colorPrimary.Neutral["neutral/300"],
  "border-solid": colorPrimary.Neutral["neutral/600"],
  "border-brand": colorPrimary.Primary["primary/500"],
  "border-brand-hover": colorPrimary.Primary["primary/600"],
  "border-brand-click": colorPrimary.Primary["primary/700"],
  "border-brand-subtle": colorPrimary.Primary["primary/200"],
  "border-white": colorPrimary.Neutral["base/white"],
  "border-error-subtle": colorPrimary.Error["error/300"],
  "border-error-disabled": colorPrimary.Error["error/200"],
  "border-error": colorPrimary.Error["error/600"],
  "border-error-hover": colorPrimary.Error["error/700"],
  "border-error-click": colorPrimary.Error["error/800"],
};

export const colorBorderDark = {
  "border-primary": colorPrimary.Neutral["neutral/600"],
  "border-secondary": colorPrimary.Neutral["neutral/700"],
  "border-tertiary": colorPrimary.Neutral["neutral/800"],
  "border-disabled": colorPrimary.Neutral["neutral/600"],
  "border-solid": colorPrimary.Neutral["neutral/300"],
  "border-brand": colorPrimary.Primary["primary/400"],
  "border-brand-hover": colorPrimary.Primary["primary/300"],
  "border-brand-click": colorPrimary.Primary["primary/200"],
  "border-brand-subtle": colorPrimary.Primary["primary/700"],
  "border-white": colorPrimary.Neutral["neutral/900"],
  "border-error-subtle": colorPrimary.Error["error/600"],
  "border-error-disabled": colorPrimary.Error["error/700"],
  "border-error": colorPrimary.Error["error/300"],
  "border-error-hover": colorPrimary.Error["error/200"],
  "border-error-click": colorPrimary.Error["error/100"],
};

export const colorBorder = {
  light: colorBorderLight,
  dark: colorBorderDark,
};
