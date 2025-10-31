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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PickButton, PickText, PickView, PickFormInput, DatePickerModal } from "@Components";
import useThemedStyles from "@Theme/Hook/useThemedStyles";
import { icons } from "@Assets";
import { registerSchema, type RegisterFormData } from "@Schemas/authSchemas";
import { useRegister } from "@Hooks";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { colors, dimensions } = useThemedStyles();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const registerMutation = useRegister();

  const dobValue = watch("dob");

  const handleRegister = (data: RegisterFormData) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        Alert.alert(
          "Đăng ký thành công",
          "Vui lòng kiểm tra email để kích hoạt tài khoản của bạn.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Login"),
            },
          ]
        );
      },
      onError: (error: any) => {
        const errorCode = error?.code;
        const errorMessage = error?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.";

        let message = errorMessage;
        if (errorCode === "EMAIL_ALREADY_EXISTS") {
          message = "Email đã được sử dụng. Vui lòng sử dụng email khác.";
        } else if (errorCode === "ACCOUNT_NOT_ACTIVATED") {
          message = "Tài khoản của bạn chưa được kích hoạt. Vui lòng kiểm tra email.";
        }

        Alert.alert("Đăng ký thất bại", message);
      },
    });
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  const handleDateConfirm = (date: Date) => {
    setValue("dob", date, { shouldValidate: true });
    setShowDatePicker(false);
  };

  return (
    <PickView flex={1} backgroundColor={colors.background["bg-primary"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 100,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <PickView paddingHorizontal={20} paddingTop={insets.top}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <PickView width={40} height={40} justifyCenter>
                <Icon name="arrow-back" size={24} color="#1a1a2e" />
              </PickView>
            </TouchableOpacity>

            {/* Logo */}
            <PickView alignCenter marginTop={20} marginBottom={30}>
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

            {/* Title */}
            <PickView gap={8} marginBottom={32} alignCenter>
              <PickText
                size={32}
                font="bold"
                align="center"
                lineHeight={40}
                style={{ color: "#1a1a2e" }}
              >
                Đăng ký
              </PickText>
              <PickText size={16} align="center" style={{ color: "#666" }}>
                Tạo tài khoản mới để bắt đầu
              </PickText>
            </PickView>

            <PickView>
              {/* Name Field */}
              <PickFormInput
                name="name"
                control={control}
                placeholder="Họ và tên"
                autoCapitalize="words"
                iconBefore={<Icon name="person-outline" size={20} color="#666" />}
                error={errors.name?.message}
              />

              {/* Email Field */}
              <PickFormInput
                name="email"
                control={control}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                iconBefore={<Icon name="mail-outline" size={20} color="#666" />}
                error={errors.email?.message}
              />

              {/* Phone Field */}
              <PickFormInput
                name="phone"
                control={control}
                placeholder="Số điện thoại"
                keyboardType="phone-pad"
                iconBefore={<Icon name="call-outline" size={20} color="#666" />}
                error={errors.phone?.message}
              />

              {/* Date of Birth Field */}
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={{ marginBottom: 16 }}
              >
                <PickView
                  style={{
                    borderWidth: 1,
                    borderColor: errors.dob ? "#ff4444" : "#e0e0e0",
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#fff",
                  }}
                >
                  <Icon
                    name="calendar-outline"
                    size={20}
                    color="#666"
                    style={{ marginRight: 12 }}
                  />
                  <PickText
                    size={16}
                    style={{
                      color: dobValue ? "#1a1a2e" : "#999",
                      flex: 1,
                    }}
                  >
                    {dobValue ? format(dobValue, "dd/MM/yyyy", { locale: vi }) : "Ngày sinh"}
                  </PickText>
                </PickView>
              </TouchableOpacity>
              {errors.dob && (
                <PickText size={12} style={{ color: "#ff4444", marginTop: 4 }}>
                  {errors.dob.message}
                </PickText>
              )}

              {/* Password Field */}
              <PickFormInput
                name="password"
                control={control}
                placeholder="Mật khẩu"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                iconBefore={<Icon name="lock-closed-outline" size={20} color="#666" />}
                iconAfter={
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={{ padding: 8 }}
                  >
                    <Icon
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                }
                error={errors.password?.message}
              />

              {/* Confirm Password Field */}
              <PickFormInput
                name="confirmPassword"
                control={control}
                placeholder="Xác nhận mật khẩu"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                iconBefore={<Icon name="lock-closed-outline" size={20} color="#666" />}
                iconAfter={
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ padding: 8 }}
                  >
                    <Icon
                      name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                }
                error={errors.confirmPassword?.message}
              />

              {/* Terms */}
              <PickText
                size={12}
                align="center"
                lineHeight={18}
                style={{ color: "#666", marginBottom: 8 }}
              >
                Bằng cách đăng ký, bạn đồng ý với{" "}
                <PickText size={12} font="semibold" style={{ color: "#6d5edc" }}>
                  Điều khoản dịch vụ
                </PickText>{" "}
                và{" "}
                <PickText size={12} font="semibold" style={{ color: "#6d5edc" }}>
                  Chính sách bảo mật
                </PickText>{" "}
                của chúng tôi
              </PickText>

              {/* Register Button */}
              <PickButton
                style={{ marginTop: 8, alignSelf: "center", width: dimensions.width - 40 }}
                type="Tertiary"
                size="sm"
                title={registerMutation.isPending ? "Đang đăng ký..." : "Đăng ký"}
                onPress={handleSubmit(handleRegister)}
                disabled={registerMutation.isPending}
              />

              {/* Login Link */}
              <PickView row justifyCenter alignCenter marginTop={8}>
                <PickText size={14} style={{ color: "#666" }}>
                  Đã có tài khoản?{" "}
                </PickText>
                <TouchableOpacity onPress={handleLogin}>
                  <PickText size={14} font="semibold" style={{ color: "#6d5edc" }}>
                    Đăng nhập
                  </PickText>
                </TouchableOpacity>
              </PickView>
            </PickView>
          </PickView>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date Picker Modal */}
      <DatePickerModal
        visible={showDatePicker}
        value={dobValue}
        minimumDate={new Date(1900, 0, 1)}
        maximumDate={new Date()}
        onConfirm={handleDateConfirm}
        onCancel={() => setShowDatePicker(false)}
      />
    </PickView>
  );
};
