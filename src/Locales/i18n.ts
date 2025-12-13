import i18next, { Resource } from "i18next";
import en from "./en";
import vi from "./vi";

export type Language = "vi" | "en";

export const DEFAULT_LANGUAGE: Language = "vi";

export const resources: Resource = {
  en: {
    translation: en,
  },
  vi: {
    translation: vi,
  },
};

export const initI18n = async (language: Language = DEFAULT_LANGUAGE) => {
  if (!i18next.isInitialized) {
    await i18next.init({
      compatibilityJSON: "v4",
      lng: language,
      fallbackLng: DEFAULT_LANGUAGE,
      resources,
      keySeparator: ".",
      interpolation: {
        escapeValue: false,
      },
    });
  } else if (i18next.language !== language) {
    await i18next.changeLanguage(language);
  }

  return i18next;
};

// Initialize with default language immediately
void initI18n(DEFAULT_LANGUAGE);

export { i18next as i18n };
