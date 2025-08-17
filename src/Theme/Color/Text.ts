import { colorPrimary } from "./Semantic";

export const colorTextLight = {
  "heading-primary": colorPrimary.Neutral["neutral/900"],
  "heading-secondary": colorPrimary.Neutral["neutral/700"],
  placeholder: colorPrimary.Neutral["neutral/500"],
  "heading-inverted": colorPrimary.Neutral["base/white"],
  body: colorPrimary.Neutral["neutral/600"],
  "body-inverted": colorPrimary.Neutral["neutral/200"],
  "body-on-brand": colorPrimary.Primary["primary/50"],
  "sub-headline-brand": colorPrimary.Primary["primary/500"],
  "footer-headline": colorPrimary.Neutral["neutral/500"],
  "footer-headline-inverted": colorPrimary.Neutral["base/white"],
  disabled: colorPrimary.Neutral["neutral/300"],
  "error-primary": colorPrimary.Error["error/600"],
  "error-secondary": colorPrimary.Error["error/500"],
};

export const colorTextDark = {
  "heading-primary": colorPrimary.Neutral["neutral/50"],
  "heading-secondary": colorPrimary.Neutral["neutral/200"],
  placeholder: colorPrimary.Neutral["neutral/400"],
  "heading-inverted": colorPrimary.Neutral["neutral/300"],
  body: colorPrimary.Neutral["neutral/200"],
  "body-inverted": colorPrimary.Neutral["neutral/700"],
  "body-on-brand": colorPrimary.Neutral["neutral/900"],
  "sub-headline-brand": colorPrimary.Primary["primary/400"],
  "footer-headline": colorPrimary.Neutral["neutral/400"],
  "footer-headline-inverted": colorPrimary.Neutral["neutral/900"],
  disabled: colorPrimary.Neutral["neutral/600"],
  "error-primary": colorPrimary.Error["error/300"],
  "error-secondary": colorPrimary.Error["error/400"],
};

export const colorText = {
  light: colorTextLight,
  dark: colorTextDark,
};
