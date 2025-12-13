import React from "react";
import {
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@Types/navigationTypes";
import Icon from "react-native-vector-icons/Ionicons";
import { useForm, Controller } from "react-hook-form";
import { useRoute } from "@react-navigation/native";
import { zodResolver } from "@hookform/resolvers/zod";
import { PickButton, PickText, PickView, PickInput, ScreenHeader } from "@Components";
import useThemedStyles from "@Theme/Hook/useThemedStyles";
import { authService } from "@Services";
import { loginSchema, type LoginFormData } from "../../Schemas/authSchemas";
import { useAuth } from "@Contexts/AuthContext";
import { getErrorMessage } from "@Constants";
import { transformLoginResponse, getUserDisplayName } from "@Utils/authHelpers";
import { icons } from "@Assets";
import { useTranslation } from "@Hooks/useTranslation";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const redirectTo = (route.params as any)?.redirectTo;
  const redirectParams = (route.params as any)?.params;
  const { colors, dimensions } = useThemedStyles();
  const { updateAuthStatus } = useAuth();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const response = await authService.login(data as { email: string; password: string });

      if (response.isAuthenticated && response.accessToken) {
        const { tokens, userInfo } = transformLoginResponse(response);

        await updateAuthStatus(tokens, userInfo);

        Alert.alert(
          t("AUTH_LOGIN_SUCCESS_TITLE"),
          t("AUTH_LOGIN_SUCCESS_MESSAGE", { name: getUserDisplayName(userInfo) }),
          [
            {
              text: t("COMMON_OK"),
              onPress: () => {
                if (redirectTo) {
                  navigation.replace(redirectTo, redirectParams);
                } else {
                  navigation.navigate("Main");
                }
              },
            },
          ]
        );
      } else {
        Alert.alert(t("AUTH_LOGIN_FAILURE_TITLE"), t("AUTH_LOGIN_FAILURE_MESSAGE"));
      }
    } catch (error: any) {
      if (__DEV__) {
        console.log("Login network error:", {
          code: error?.code,
          message: error?.message,
          status: error?.status,
        });
      }

      const errorCode = error?.code || error?.response?.data?.code;
      const errorMessage = getErrorMessage(
        errorCode,
        error?.message || t("AUTH_LOGIN_NETWORK_ERROR")
      );

      Alert.alert(t("COMMON_ERROR"), errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <PickView flex={1} backgroundColor={colors.background["bg-primary"]}>
      <ScreenHeader title={t("AUTH_LOGIN_TITLE")} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <PickView>
            <PickView paddingHorizontal={20} alignCenter marginTop={20} marginBottom={30}>
              <PickView
                width={100}
                height={100}
                borderRadius={50}
                justifyCenter
                alignCenter
                borderColor={colors.border["border-brand"]}
                borderWidth={1}
              >
                <Image
                  source={icons.logoOnlyIcon}
                  style={{ width: 80, height: 80 }}
                  resizeMode="contain"
                />
              </PickView>
            </PickView>

            <PickView paddingHorizontal={20} gap={8} marginBottom={32} alignCenter>
              <PickText size={32} font="bold" align="center" lineHeight={40}>
                {t("AUTH_LOGIN_TITLE")}
              </PickText>
              <PickText size={16} align="center" color="placeholder">
                {t("AUTH_LOGIN_SUBTITLE")}
              </PickText>
            </PickView>

            <PickView paddingHorizontal={20} gap={16}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <PickInput
                    placeholder={t("AUTH_EMAIL_PLACEHOLDER")}
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    iconBefore={
                      <Icon name="mail-outline" size={20} color={colors.text["placeholder"]} />
                    }
                    helperText={errors.email?.message}
                    isError={!!errors.email}
                    containerStyle={{ marginBottom: 0 }}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <PickInput
                    placeholder={t("AUTH_PASSWORD_PLACEHOLDER")}
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    iconBefore={
                      <Icon
                        name="lock-closed-outline"
                        size={20}
                        color={colors.text["placeholder"]}
                      />
                    }
                    iconAfter={
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={{ padding: 8 }}
                      >
                        <Icon
                          name={showPassword ? "eye-outline" : "eye-off-outline"}
                          size={20}
                          color={colors.text["placeholder"]}
                        />
                      </TouchableOpacity>
                    }
                    helperText={errors.password?.message}
                    isError={!!errors.password}
                    containerStyle={{ marginBottom: 0 }}
                  />
                )}
              />

              <TouchableOpacity onPress={handleForgotPassword} style={{ alignSelf: "flex-end" }}>
                <PickText size={14} font="semibold" style={{ color: "#6d5edc" }}>
                  {t("AUTH_FORGOT_PASSWORD")}
                </PickText>
              </TouchableOpacity>

              <PickButton
                style={{ marginTop: 8, alignSelf: "center", width: dimensions.width - 40 }}
                type="Tertiary"
                size="sm"
                title={isLoading ? t("AUTH_LOGIN_LOADING") : t("AUTH_LOGIN_BUTTON")}
                onPress={handleSubmit(handleLogin)}
                disabled={isLoading}
              />

              <PickView row justifyCenter alignCenter marginTop={8}>
                <PickText size={14} style={{ color: "#666" }}>
                  {t("AUTH_NO_ACCOUNT")}{" "}
                </PickText>
                <TouchableOpacity onPress={handleRegister}>
                  <PickText size={14} font="semibold" style={{ color: "#6d5edc" }}>
                    {t("AUTH_REGISTER_NOW")}
                  </PickText>
                </TouchableOpacity>
              </PickView>
            </PickView>
          </PickView>
        </ScrollView>
      </KeyboardAvoidingView>
    </PickView>
  );
};
