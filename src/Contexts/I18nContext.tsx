import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { TFunction } from "i18next";
import { DEFAULT_LANGUAGE, Language, i18n, initI18n } from "@Locales/i18n";
import { STORAGE_KEYS } from "@Constants";

interface I18nContextValue {
  language: Language;
  t: TFunction;
  changeLanguage: (lang: Language) => Promise<void>;
  isReady: boolean;
}

const I18nContext = createContext<I18nContextValue | null>(null);

interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const stored = (await AsyncStorage.getItem(STORAGE_KEYS.APP.LANGUAGE_PREFERENCE)) as
          | Language
          | "vn"
          | null;
        const normalized = stored === "vn" ? "vi" : stored;
        const nextLanguage =
          normalized === "en" || normalized === "vi" ? normalized : DEFAULT_LANGUAGE;

        await initI18n(nextLanguage);
        setLanguage(nextLanguage);
      } catch (error) {
        if (__DEV__) {
          console.warn("⚠️ Failed to load language preference:", error);
        }
      } finally {
        setIsReady(true);
      }
    };

    loadLanguage();
  }, []);

  const changeLanguage = useCallback(
    async (lang: Language) => {
      try {
        setLanguage(lang);
        await initI18n(lang);
        await AsyncStorage.setItem(STORAGE_KEYS.APP.LANGUAGE_PREFERENCE, lang);
      } catch (error) {
        if (__DEV__) {
          console.warn("⚠️ Failed to change language:", error);
        }
        throw error;
      }
    },
    [setLanguage]
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      t: i18n.getFixedT(language),
      changeLanguage,
      isReady,
    }),
    [language, changeLanguage, isReady]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18nContext = (): I18nContextValue => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18nContext must be used within an I18nProvider");
  }
  return ctx;
};

export { I18nContext };
