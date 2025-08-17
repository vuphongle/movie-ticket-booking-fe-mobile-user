import { colorPrimary } from "./Semantic";

export const colorIconLight = {
  "icon-primary": colorPrimary.Neutral["neutral/900"],
  "icon-secondary": colorPrimary.Neutral["neutral/800"],
  "icon-tertiary": colorPrimary.Neutral["neutral/700"],
  "icon-quaternary": colorPrimary.Neutral["neutral/600"],
  "icon-quinary": colorPrimary.Neutral["neutral/500"],
  "icon-senary": colorPrimary.Primary["primary/400"],
  "icon-septenary": colorPrimary.Primary["primary/300"],
  "icon-on-fill": colorPrimary.Neutral["base/white"],
  "icon-brand-primary": colorPrimary.Primary["primary/600"],
  "icon-brand-secondary": colorPrimary.Primary["primary/500"],
  "icon-brand-tertiary": colorPrimary.Primary["primary/700"],
  "icon-brand-disabled": colorPrimary.Primary["primary/200"],
  "icon-success-primary": colorPrimary.Success["success/500"],
  "icon-success-secondary": colorPrimary.Success["success/600"],
  "icon-warning-primary": colorPrimary.Warning["warning/500"],
  "icon-warning-secondary": colorPrimary.Warning["warning/600"],
  "icon-error-primary": colorPrimary.Error["error/800"],
  "icon-error-secondary": colorPrimary.Error["error/700"],
  "icon-error-tertiary": colorPrimary.Error["error/600"],
  "icon-error-quarternary": colorPrimary.Error["error/500"],
  "icon-error-disabled": colorPrimary.Error["error/200"],
};

export const colorIconDark = {
  "icon-primary": colorPrimary.Neutral["neutral/500"],
  "icon-secondary": colorPrimary.Neutral["neutral/100"],
  "icon-tertiary": colorPrimary.Neutral["neutral/200"],
  "icon-quaternary": colorPrimary.Neutral["neutral/300"],
  "icon-quinary": colorPrimary.Neutral["neutral/400"],
  "icon-senary": colorPrimary.Neutral["neutral/400"],
  "icon-septenary": colorPrimary.Primary["primary/600"],
  "icon-on-fill": colorPrimary.Neutral["neutral/900"],
  "icon-brand-primary": colorPrimary.Primary["primary/300"],
  "icon-brand-secondary": colorPrimary.Primary["primary/400"],
  "icon-brand-tertiary": colorPrimary.Primary["primary/200"],
  "icon-brand-disabled": colorPrimary.Primary["primary/700"],
  "icon-success-primary": colorPrimary.Success["success/400"],
  "icon-success-secondary": colorPrimary.Success["success/300"],
  "icon-warning-primary": colorPrimary.Warning["warning/400"],
  "icon-warning-secondary": colorPrimary.Warning["warning/600"],
  "icon-error-primary": colorPrimary.Error["error/100"],
  "icon-error-secondary": colorPrimary.Error["error/200"],
  "icon-error-tertiary": colorPrimary.Error["error/300"],
  "icon-error-quarternary": colorPrimary.Error["error/400"],
  "icon-error-disabled": colorPrimary.Error["error/700"],
};

export const colorIcon = {
  light: colorIconLight,
  dark: colorIconDark,
};
