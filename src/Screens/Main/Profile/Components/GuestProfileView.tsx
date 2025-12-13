import React, { useMemo } from "react";
import { ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@Types/navigationTypes";
import Icon from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PickButton, PickText, PickView } from "@Components";
import useThemedStyles from "@Theme/Hook/useThemedStyles";
import { useTranslation } from "@Hooks/useTranslation";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
}

export const GuestProfileView: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { colors, dimensions } = useThemedStyles();
  const { t } = useTranslation();
  const screenWidth = dimensions.width;
  const buttonWidth = (screenWidth - 32 - 16) / 2;

  const features: Feature[] = useMemo(
    () => [
      {
        icon: "person-circle-outline",
        title: t("PROFILE_GUEST_FEATURE_MANAGE_INFO_TITLE"),
        description: t("PROFILE_GUEST_FEATURE_MANAGE_INFO_DESCRIPTION"),
        color: "#6d5edc",
      },
      {
        icon: "ticket-outline",
        title: t("PROFILE_GUEST_FEATURE_TICKET_HISTORY_TITLE"),
        description: t("PROFILE_GUEST_FEATURE_TICKET_HISTORY_DESCRIPTION"),
        color: "#2193b0",
      },
      {
        icon: "star-outline",
        title: t("PROFILE_GUEST_FEATURE_VIP_TITLE"),
        description: t("PROFILE_GUEST_FEATURE_VIP_DESCRIPTION"),
        color: "#ffd700",
      },
      {
        icon: "gift-outline",
        title: t("PROFILE_GUEST_FEATURE_PROMOTIONS_TITLE"),
        description: t("PROFILE_GUEST_FEATURE_PROMOTIONS_DESCRIPTION"),
        color: "#ff6b6b",
      },
      {
        icon: "card-outline",
        title: t("PROFILE_GUEST_FEATURE_FAST_PAYMENT_TITLE"),
        description: t("PROFILE_GUEST_FEATURE_FAST_PAYMENT_DESCRIPTION"),
        color: "#4ecdc4",
      },
    ],
    [t]
  );

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <PickView flex={1} backgroundColor={colors.background["bg-primary"]}>
      <PickView
        paddingHorizontal={16}
        backgroundColor={colors.background["bg-brand-quaternary"]}
        paddingVertical={16}
        alignCenter
        paddingTop={insets.top}
      >
        <PickView
          width={100}
          height={100}
          justifyCenter
          alignCenter
          backgroundColor="white"
          borderRadius={100}
        >
          <Icon name="person-outline" size={60} color="#6d5edc" />
        </PickView>

        <PickView gap={12} marginTop={16} alignCenter justifyCenter>
          <PickText
            size={28}
            font="bold"
            color="body-inverted"
            align="center"
            lineHeight={36}
            numberOfLines={2}
            style={{ maxWidth: 250 }}
          >
            {t("PROFILE_GUEST_HERO_TITLE")}
          </PickText>
          <PickText
            size={16}
            color="body-inverted"
            align="center"
            lineHeight={22}
            style={{
              marginBottom: 30,
            }}
            numberOfLines={2}
          >
            {t("PROFILE_GUEST_HERO_SUBTITLE")}
          </PickText>
        </PickView>

        <PickView row gap={16}>
          <PickButton
            style={{ marginTop: 8, alignSelf: "center", width: buttonWidth }}
            type="Tertiary"
            size="sm"
            title={t("PROFILE_GUEST_LOGIN")}
            onPress={handleLogin}
          />
          <PickButton
            style={{ marginTop: 8, alignSelf: "center", width: buttonWidth }}
            type="Tertiary"
            size="sm"
            title={t("PROFILE_GUEST_REGISTER")}
            onPress={handleRegister}
          />
        </PickView>
      </PickView>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 100,
          backgroundColor: colors.background["bg-primary"],
        }}
        showsVerticalScrollIndicator={false}
      >
        <PickView paddingHorizontal={20} paddingTop={30}>
          <PickText size={24} font="bold" style={{ color: "#1a1a2e", marginBottom: 8 }}>
            {t("PROFILE_GUEST_SECTION_TITLE")}
          </PickText>
          <PickText size={14} style={{ color: "#666", marginBottom: 20 }}>
            {t("PROFILE_GUEST_SECTION_SUBTITLE")}
          </PickText>

          {features.map((feature, index) => (
            <PickView
              key={index}
              row
              alignCenter
              backgroundColor="white"
              padding={16}
              borderRadius={12}
              marginBottom={12}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <PickView
                width={56}
                height={56}
                borderRadius={12}
                justifyCenter
                alignCenter
                marginRight={16}
                backgroundColor={feature.color + "20"}
              >
                <Icon name={feature.icon} size={28} color={feature.color} />
              </PickView>

              <PickView flex={1}>
                <PickText size={16} font="semibold" style={{ color: "#1a1a2e", marginBottom: 4 }}>
                  {feature.title}
                </PickText>
                <PickText size={13} lineHeight={18} style={{ color: "#666" }}>
                  {feature.description}
                </PickText>
              </PickView>
            </PickView>
          ))}
        </PickView>

        {/* Bottom CTA */}
        <PickView marginTop={30} paddingHorizontal={20} alignCenter>
          <PickText size={14} style={{ color: "#666" }}>
            {t("PROFILE_GUEST_CTA_LABEL")}{" "}
            <PickText size={14} font="semibold" onPress={handleLogin} style={{ color: "#6d5edc" }}>
              {t("PROFILE_GUEST_CTA_ACTION")}
            </PickText>
          </PickText>
        </PickView>
      </ScrollView>
    </PickView>
  );
};
