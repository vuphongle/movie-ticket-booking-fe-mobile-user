import React, { useMemo, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PickText, PickView, ScreenHeader } from "@Components";
import useThemedStyles from "@Theme/Hook/useThemedStyles";
import { useTranslation } from "@Hooks/useTranslation";
import { i18n, Language } from "@Locales/i18n";

type LanguageOption = {
  code: Language;
  label: string;
  description: string;
  badge: string;
};

const SettingsScreen: React.FC = () => {
  const { colors, spacing } = useThemedStyles();
  const { t, language, changeLanguage } = useTranslation();
  const insets = useSafeAreaInsets();
  const [isApplying, setIsApplying] = useState(false);

  const languageOptions = useMemo<LanguageOption[]>(
    () => [
      {
        code: "vi",
        label: t("SETTINGS_OPTION_VI_LABEL"),
        description: t("SETTINGS_OPTION_VI_DESCRIPTION"),
        badge: "VI",
      },
      {
        code: "en",
        label: t("SETTINGS_OPTION_EN_LABEL"),
        description: t("SETTINGS_OPTION_EN_DESCRIPTION"),
        badge: "EN",
      },
    ],
    [t]
  );

  const handleSelectLanguage = async (lang: Language) => {
    if (lang === language || isApplying) {
      return;
    }

    setIsApplying(true);
    try {
      await changeLanguage(lang);
      const nextT = i18n.getFixedT(lang);
      Alert.alert(nextT("SETTINGS_LANGUAGE_CHANGED_TITLE"), nextT("SETTINGS_LANGUAGE_CHANGED_MESSAGE"));
    } catch (error) {
      if (__DEV__) {
        console.warn("⚠️ Failed to apply language:", error);
      }
    } finally {
      setIsApplying(false);
    }
  };

  const activeOption = languageOptions.find((option) => option.code === language);

  return (
    <PickView flex={1} backgroundColor={colors.background["bg-primary"]}>
      <ScreenHeader title={t("SETTINGS_TITLE")} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: spacing.s20,
          paddingTop: spacing.s16,
          paddingBottom: insets.bottom + spacing.s32,
          gap: spacing.s16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <PickView
          padding={spacing.s16}
          borderRadius={12}
          backgroundColor="white"
          style={{
            borderWidth: 1,
            borderColor: colors.border["border-secondary"],
            shadowColor: "#000",
            shadowOpacity: 0.04,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 2,
          }}
        >
          <PickText size={18} font="bold" style={{ color: "#1a1a2e", marginBottom: spacing.s8 }}>
            {t("SETTINGS_LANGUAGE_CARD_TITLE")}
          </PickText>
          <PickText size={14} style={{ color: "#4b5563", marginBottom: spacing.s12 }}>
            {t("SETTINGS_LANGUAGE_CARD_SUBTITLE")}
          </PickText>

          {languageOptions.map((option) => {
            const isActive = option.code === language;
            return (
              <TouchableOpacity
                key={option.code}
                onPress={() => handleSelectLanguage(option.code)}
                activeOpacity={0.85}
                style={{ marginBottom: spacing.s12 }}
              >
                <PickView
                  row
                  alignCenter
                  backgroundColor={isActive ? "#e7f1ff" : "#f8fafc"}
                  padding={spacing.s12}
                  borderRadius={12}
                  style={{
                    borderWidth: 1,
                    borderColor: isActive ? "#1d4ed8" : colors.border["border-secondary"],
                    gap: spacing.s12,
                  }}
                >
                  <PickView
                    width={42}
                    height={42}
                    borderRadius={12}
                    alignCenter
                    justifyCenter
                    backgroundColor={isActive ? "#1d4ed8" : "#e0e7ff"}
                  >
                    <PickText font="bold" color="body-inverted">
                      {option.badge}
                    </PickText>
                  </PickView>

                  <PickView flex={1}>
                    <PickText size={16} font="semibold" style={{ color: "#111827" }}>
                      {option.label}
                    </PickText>
                    <PickText size={13} style={{ color: "#4b5563", marginTop: 4 }}>
                      {option.description}
                    </PickText>
                  </PickView>

                  {isActive ? (
                    <Icon name="checkmark-circle" size={24} color="#1d4ed8" />
                  ) : (
                    <Icon name="ellipse-outline" size={24} color="#9ca3af" />
                  )}
                </PickView>
              </TouchableOpacity>
            );
          })}
        </PickView>

        <PickView
          padding={spacing.s16}
          borderRadius={12}
          backgroundColor="#0f3c8b"
          style={{
            gap: spacing.s8,
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 6 },
            elevation: 3,
          }}
        >
          <PickText size={14} color="body-on-brand" style={{ opacity: 0.9 }}>
            {t("SETTINGS_DESCRIPTION")}
          </PickText>
          <PickView row alignCenter gap={8}>
            <PickText size={13} color="body-on-brand" style={{ opacity: 0.8 }}>
              {t("SETTINGS_CURRENT_LANGUAGE")}:
            </PickText>
            <PickText size={15} font="semibold" color="body-on-brand">
              {activeOption?.label}
            </PickText>
            {isApplying && <ActivityIndicator size="small" color="#fff" />}
          </PickView>
        </PickView>
      </ScrollView>
    </PickView>
  );
};

export default SettingsScreen;
