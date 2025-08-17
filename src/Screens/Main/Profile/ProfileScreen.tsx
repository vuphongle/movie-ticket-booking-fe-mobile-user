import React, { useEffect, useState } from "react";
import { ScrollView, Image, StyleSheet } from "react-native";
import { PickButton, PickText, PickView } from "@Components";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "@Theme/ThemeContext";
import { LanguagePicker } from "@Components/LanguagePicker/LanguagePicker";
import useThemedStyles from "@Theme/Hook/useThemedStyles";
import { useAuth } from "@Contexts/AuthContext";
import { useLoadingHandler } from "@Hooks/useLoadingHandler";
import { UserProfile } from "@Types/userTypes";

const AVATAR_SIZE = 96;

const ProfileScreen = React.memo(() => {
  const { t } = useTranslation();
  const themeContext = React.useContext(ThemeContext);
  const { colors, spacing, radius } = useThemedStyles();
  const { state, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { isLoading, withLoading } = useLoadingHandler();

  const handleLogout = async () => {
    await logout();
  };

  const toggleTheme = () => {
    if (themeContext) {
      themeContext.toggleTheme();
    }
  };

  const loadProfile = async () => {};

  useEffect(() => {
    loadProfile();
  }, []);

  const avatarUri = "https://placehold.co/200x200?text=L";
  return (
    <PickView flex={1} backgroundColor={colors.background["bg-primary"]}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: spacing.s20,
          paddingBottom: spacing.s32,
          paddingHorizontal: spacing.s10,
        }}
      >
        <PickView
          alignItems="center"
          style={{ paddingTop: spacing.s32, paddingBottom: spacing.s20 }}
        >
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
          <PickText variant="h5" style={{ fontWeight: "700", fontSize: 22, marginBottom: 2 }}>
            {t("PROFILE", "Profile")}
          </PickText>
          <PickText
            variant="body_small"
            style={{ color: colors.text["placeholder"], fontSize: 15, marginBottom: 4 }}
          >
            {t("MANAGE_YOUR_PROFILE", "Manage your profile information")}
          </PickText>
        </PickView>

        <PickView
          backgroundColor={colors.background["bg-primary-cards"]}
          style={{
            borderRadius: radius.r16,
            marginBottom: spacing.s16,
            paddingVertical: spacing.s10,
            elevation: 4,
            shadowColor: colors.text["heading-primary"],
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.12,
            shadowRadius: 8,
          }}
        >
          <PickText
            variant="h6"
            style={{
              marginBottom: spacing.s12,
              textAlign: "center",
              fontWeight: "700",
              fontSize: 18,
            }}
          >
            {t("USER_INFO", "User Information")}
          </PickText>
          <PickView flexDirection="row" alignItems="center" style={{ gap: 6, marginBottom: 8 }}>
            <Icon
              name="email-outline"
              size={22}
              color={colors.text["placeholder"]}
              style={{ width: 22, height: 22, marginRight: 4, marginLeft: 10 }}
            />
            <PickText
              variant="body_small"
              style={{ fontWeight: "600", flex: 1, color: colors.text["heading-primary"] }}
            >
              {t("EMAIL", "Email")}:
            </PickText>
            <PickText variant="body_small">{state.user?.email}</PickText>
          </PickView>
          {profile?.phoneNumber && (
            <PickView flexDirection="row" alignItems="center" style={{ gap: 6, marginBottom: 8 }}>
              <Icon
                name="phone-outline"
                size={22}
                color={colors.text["placeholder"]}
                style={{ width: 22, height: 22, marginRight: 4, marginLeft: 10 }}
              />
              <PickText
                variant="body_small"
                style={{ fontWeight: "600", flex: 1, color: colors.text["heading-primary"] }}
              >
                {t("PHONE", "Phone")}:
              </PickText>
              <PickText variant="body_small">{profile.phoneNumber}</PickText>
            </PickView>
          )}
          {state.user?.preferred_username && (
            <PickView flexDirection="row" alignItems="center" style={{ gap: 6, marginBottom: 8 }}>
              <Icon
                name="account-outline"
                size={22}
                color={colors.text["placeholder"]}
                style={{ width: 22, height: 22, marginRight: 4 }}
              />
              <PickText
                variant="body_small"
                style={{ fontWeight: "600", flex: 1, color: colors.text["heading-primary"] }}
              >
                {t("USERNAME", "Username")}:
              </PickText>
              <PickText variant="body_small">{state.user.preferred_username}</PickText>
            </PickView>
          )}
          {state.user?.roles && state.user.roles.length > 0 && (
            <PickView flexDirection="row" alignItems="center" style={{ gap: 6, marginBottom: 8 }}>
              <Icon
                name="account-badge-outline"
                size={22}
                color={colors.text["placeholder"]}
                style={{ width: 22, height: 22, marginRight: 4, marginLeft: 10 }}
              />
              <PickText
                variant="body_small"
                style={{ fontWeight: "600", flex: 1, color: colors.text["heading-primary"] }}
              >
                {t("ROLES", "Roles")}:
              </PickText>
              <PickText variant="body_small">{state.user.roles.join(", ")}</PickText>
            </PickView>
          )}
          {profile?.isExternal && (
            <PickView flexDirection="row" alignItems="center" style={{ gap: 6, marginBottom: 8 }}>
              <Icon
                name="link-variant"
                size={22}
                color={colors.text["placeholder"]}
                style={{ width: 22, height: 22, marginRight: 4, marginLeft: 10 }}
              />
              <PickText
                variant="body_small"
                style={{ fontWeight: "600", flex: 1, color: colors.text["heading-primary"] }}
              >
                {t("EXTERNAL_ACCOUNT", "External Account")}:
              </PickText>
              <PickText variant="body_small">{t("YES", "Yes")}</PickText>
            </PickView>
          )}
          {profile && !profile.hasPassword && (
            <PickView flexDirection="row" alignItems="center" style={{ gap: 6, marginBottom: 8 }}>
              <Icon
                name="lock-open-variant-outline"
                size={22}
                color={colors.text["placeholder"]}
                style={{ width: 22, height: 22, marginRight: 4, marginLeft: 10 }}
              />
              <PickText
                variant="body_small"
                style={{ fontWeight: "600", flex: 1, color: colors.text["heading-primary"] }}
              >
                {t("HAS_PASSWORD", "Has Password")}:
              </PickText>
              <PickText variant="body_small">{t("NO", "No")}</PickText>
            </PickView>
          )}
        </PickView>

        <PickView
          backgroundColor={colors.background["bg-primary-cards"]}
          style={{
            borderRadius: radius.r16,
            marginBottom: spacing.s16,
            paddingVertical: spacing.s10,
            elevation: 4,
            shadowColor: colors.text["heading-primary"],
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.12,
            shadowRadius: 8,
          }}
        >
          <PickText
            variant="h6"
            style={{
              marginBottom: spacing.s12,
              textAlign: "center",
              fontWeight: "700",
              fontSize: 18,
            }}
          >
            {t("SETTINGS", "Settings")}
          </PickText>
          <PickView
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <PickView style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon
                name="web"
                size={22}
                color={colors.text["placeholder"]}
                style={{ marginRight: 6, marginLeft: 10 }}
              />
              <PickText
                variant="body_small"
                style={{ fontWeight: "600", color: colors.text["heading-primary"] }}
              >
                {t("LANGUAGE", "Language")}
              </PickText>
            </PickView>
            <PickView style={{ marginRight: 10 }}>
              <LanguagePicker />
            </PickView>
          </PickView>
          <PickView
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <PickView style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon
                name="theme-light-dark"
                size={22}
                color={colors.text["placeholder"]}
                style={{ marginRight: 6, marginLeft: 10 }}
              />
              <PickText
                variant="body_small"
                style={{ fontWeight: "600", color: colors.text["heading-primary"] }}
              >
                {t("THEME", "Theme")}
              </PickText>
            </PickView>
            <PickButton
              size="sm"
              type="Primary"
              onPress={toggleTheme}
              style={{ minWidth: 80, marginRight: 10 }}
              title={themeContext?.theme === "light" ? t("DARK", "Dark") : t("LIGHT", "Light")}
            ></PickButton>
          </PickView>
        </PickView>

        <PickButton
          style={{
            marginTop: spacing.s16,
            marginBottom: spacing.s16,
            borderRadius: 24,
            width: "100%",
            alignSelf: "center",
            elevation: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
          type="Primary"
          onPress={handleLogout}
          disabled={isLoading || state.isLoading}
          size="lg"
          title={
            isLoading || state.isLoading
              ? t("LOGGING_OUT", "Logging out...")
              : t("LOGOUT", "Logout")
          }
        ></PickButton>
      </ScrollView>
    </PickView>
  );
});

const styles = StyleSheet.create({
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default ProfileScreen;
