import React, { useState } from "react";
import { ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Icon from "react-native-vector-icons/Ionicons";
import { PickText, PickView, PickFormInput, ScreenHeader } from "@Components";
import useThemedStyles from "@Theme/Hook/useThemedStyles";
import { useAuth } from "@Contexts/AuthContext";
import { useChangePassword, useKeyboard } from "@Hooks";
import { changePasswordSchema, type ChangePasswordFormData } from "@Schemas/authSchemas";
import { useTranslation } from "@Hooks/useTranslation";

export const ChangePasswordScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useThemedStyles();
  const { logout } = useAuth();
  const { keyboardShown } = useKeyboard();
  const { t } = useTranslation();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { mutate: changePassword, isPending } = useChangePassword({
    onSuccess: async () => {
      // Show success message and force logout
      Alert.alert(
        t("AUTH_CHANGE_PASSWORD_SUCCESS_TITLE"),
        t("AUTH_CHANGE_PASSWORD_SUCCESS_MESSAGE"),
        [
          {
            text: t("COMMON_OK"),
            onPress: async () => {
              try {
                await logout();
              } catch (error) {
                if (__DEV__) {
                  console.error("❌ Logout error:", error);
                }
              }
            },
          },
        ],
        { cancelable: false }
      );
    },
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    changePassword(data);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <PickView flex={1} backgroundColor={colors.background["bg-primary"]}>
        {/* Header */}
        <ScreenHeader title={t("AUTH_CHANGE_PASSWORD_TITLE")} />
        {/* Form Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: insets.bottom + 100,
          }}
          showsVerticalScrollIndicator={false}
        >
          <PickView
            paddingHorizontal={16}
            paddingVertical={12}
            borderRadius={12}
            backgroundColor="#fef3c7"
            marginBottom={24}
            row
            alignCenter
            gap={12}
          >
            <Icon name="information-circle" size={24} color="#f59e0b" />
            <PickView flex={1}>
              <PickText size={13} style={{ color: "#92400e", lineHeight: 18 }}>
                {t("AUTH_PASSWORD_RULES")}
              </PickText>
            </PickView>
          </PickView>

          <PickView>
            <PickFormInput
              control={control}
              name="oldPassword"
              label={t("AUTH_CHANGE_PASSWORD_OLD_LABEL")}
              placeholder={t("AUTH_CHANGE_PASSWORD_OLD_PLACEHOLDER")}
              secureTextEntry={!showOldPassword}
              autoCapitalize="none"
              iconBefore={<Icon name="lock-closed-outline" size={20} color="#666" />}
              iconAfter={
                <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)}>
                  <Icon
                    name={showOldPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              }
            />

            {/* New Password */}
            <PickFormInput
              control={control}
              name="newPassword"
              label={t("AUTH_CHANGE_PASSWORD_NEW_LABEL")}
              placeholder={t("AUTH_CHANGE_PASSWORD_NEW_PLACEHOLDER")}
              secureTextEntry={!showNewPassword}
              autoCapitalize="none"
              iconBefore={<Icon name="lock-closed-outline" size={20} color="#666" />}
              iconAfter={
                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                  <Icon
                    name={showNewPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              }
            />

            {/* Confirm New Password */}
            <PickFormInput
              control={control}
              name="confirmPassword"
              label={t("AUTH_CHANGE_PASSWORD_CONFIRM_LABEL")}
              placeholder={t("AUTH_CHANGE_PASSWORD_CONFIRM_PLACEHOLDER")}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              iconBefore={<Icon name="lock-closed-outline" size={20} color="#666" />}
              iconAfter={
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Icon
                    name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              }
            />
          </PickView>

          {/* Security Notice */}
          <PickView
            paddingHorizontal={16}
            paddingVertical={12}
            borderRadius={12}
            backgroundColor="#fee2e2"
            marginTop={16}
            row
            alignCenter
            gap={12}
          >
            <Icon name="shield-checkmark" size={24} color="#dc2626" />
            <PickView flex={1}>
              <PickText size={13} font="semibold" style={{ color: "#7f1d1d", marginBottom: 4 }}>
                {t("AUTH_CHANGE_PASSWORD_NOTICE_TITLE")}
              </PickText>
              <PickText size={12} style={{ color: "#7f1d1d", lineHeight: 16 }}>
                {t("AUTH_CHANGE_PASSWORD_NOTICE_DESCRIPTION")}
              </PickText>
            </PickView>
          </PickView>
        </ScrollView>

        {/* Submit Button */}
        <PickView
          paddingHorizontal={20}
          paddingTop={16}
          paddingBottom={keyboardShown ? 16 : insets.bottom + 16}
          backgroundColor="white"
        >
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={!isDirty || isPending}
            activeOpacity={0.8}
          >
            <PickView
              paddingVertical={16}
              borderRadius={12}
              justifyCenter
              alignCenter
              backgroundColor={
                !isDirty || isPending ? "#d1d5db" : colors.background["bg-brand-quaternary"]
              }
            >
              {isPending ? (
                <PickText size={16} font="semibold" color="body-inverted">
                  {t("COMMON_PROCESSING")}
                </PickText>
              ) : (
                <PickText size={16} font="semibold" color="body-inverted">
                  {t("AUTH_CHANGE_PASSWORD_BUTTON")}
                </PickText>
              )}
            </PickView>
          </TouchableOpacity>
        </PickView>
      </PickView>
    </KeyboardAvoidingView>
  );
};
