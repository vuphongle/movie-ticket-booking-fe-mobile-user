import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation files
import en from "./en.json";
import vi from "./vi.json";

// the translations
const resources = {
  en: {
    translation: en,
  },
  vi: {
    translation: vi,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "vi", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // react already does escaping
    },
  });

export default i18n;
