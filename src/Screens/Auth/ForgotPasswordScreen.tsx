import React from "react";
import { ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@Types/navigationTypes";
import Icon from "react-native-vector-icons/Ionicons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PickButton, PickText, PickView, PickInput, ScreenHeader } from "@Components";
import useThemedStyles from "@Theme/Hook/useThemedStyles";
import { authService } from "@Services";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@Schemas/authSchemas";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const COOLDOWN_SECONDS = 30;

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors, dimensions } = useThemedStyles();
  const [isLoading, setIsLoading] = React.useState(false);
  const [cooldown, setCooldown] = React.useState<number>(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  React.useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [cooldown]);

  const doSend = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      await authService.forgotPassword(data.email);

      setCooldown(COOLDOWN_SECONDS);

      Alert.alert(
        "Yêu cầu gửi email thành công",
        "Vui lòng kiểm tra email để nhận hướng dẫn đặt lại mật khẩu.",
        [
          {
            text: "OK",
          },
        ]
      );
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "Đã xảy ra lỗi";
      Alert.alert("Lỗi", message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async (email: string) => {
    if (cooldown > 0) return;
    await doSend({ email });
  };

  return (
    <PickView flex={1} backgroundColor={colors.background["bg-primary"]}>
      <ScreenHeader
        title="Quên mật khẩu"
        backgroundColor={colors.background["bg-brand-quaternary"]}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
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
                <Icon name="lock-closed-outline" size={60} color={colors.border["border-brand"]} />
              </PickView>
            </PickView>

            <PickView paddingHorizontal={20} gap={8} marginBottom={32} alignCenter>
              <PickText size={24} font="bold" align="center" lineHeight={30}>
                Quên mật khẩu
              </PickText>
              <PickText size={14} align="center" color="placeholder">
                Nhập email đã đăng ký của bạn. Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.
              </PickText>
            </PickView>

            <PickView paddingHorizontal={20} gap={16}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <PickInput
                    placeholder="Email"
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

              <PickButton
                style={{ marginTop: 8, alignSelf: "center", width: dimensions.width - 40 }}
                type="Tertiary"
                size="sm"
                title={isLoading ? "Đang gửi..." : "Gửi email"}
                onPress={handleSubmit(doSend)}
                disabled={isLoading}
              />

              <PickView row justifyCenter alignCenter marginTop={8} gap={8}>
                <PickText size={14} style={{ color: "#666" }}>
                  Chưa nhận được email?
                </PickText>
                <TouchableOpacity
                  onPress={async () => {
                    const current = (control as any)._formValues?.email as string | undefined;
                    if (!current) {
                      Alert.alert("Lỗi", "Vui lòng nhập email trước khi gửi lại.");
                      return;
                    }
                    await handleResend(current);
                  }}
                  disabled={cooldown > 0}
                >
                  <PickText
                    size={14}
                    font="semibold"
                    style={{ color: cooldown > 0 ? "#999" : "#6d5edc" }}
                  >
                    {cooldown > 0 ? `Gửi lại (${cooldown}s)` : "Gửi lại"}
                  </PickText>
                </TouchableOpacity>
              </PickView>

              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                style={{ marginTop: 12, alignSelf: "center" }}
              >
                <PickText size={14} font="semibold" style={{ color: "#6d5edc" }}>
                  Quay lại đăng nhập
                </PickText>
              </TouchableOpacity>
            </PickView>
          </PickView>
        </ScrollView>
      </KeyboardAvoidingView>
    </PickView>
  );
};

export default ForgotPasswordScreen;
