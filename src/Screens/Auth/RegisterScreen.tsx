import React from "react";
import { ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@Types/navigationTypes";
import Icon from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PickButton, PickText, PickView, PickInput } from "@Components";
import useThemedStyles from "@Theme/Hook/useThemedStyles";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { colors, dimensions } = useThemedStyles();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleRegister = () => {
    // TODO: Implement register logic
    console.log("Register with:", { name, email, phone, password });
  };

  const handleLogin = () => {
    navigation.navigate("Login");
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
          <PickView paddingHorizontal={20} paddingTop={insets.top + 20}>
            {/* Back Button */}
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
                backgroundColor="#6d5edc"
                style={{
                  shadowColor: "#6d5edc",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <Icon name="person-add-outline" size={48} color="#fff" />
              </PickView>
            </PickView>

            {/* Title */}
            <PickView gap={8} marginBottom={32} alignCenter>
              <PickText size={32} font="bold" align="center" style={{ color: "#1a1a2e" }}>
                Đăng ký
              </PickText>
              <PickText size={16} align="center" style={{ color: "#666" }}>
                Tạo tài khoản mới để bắt đầu
              </PickText>
            </PickView>

            {/* Form */}
            <PickView gap={16}>
              {/* Name Input */}
              <PickInput
                placeholder="Họ và tên"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                iconBefore={<Icon name="person-outline" size={20} color="#666" />}
                containerStyle={{ marginBottom: 0 }}
              />

              {/* Email Input */}
              <PickInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                iconBefore={<Icon name="mail-outline" size={20} color="#666" />}
                containerStyle={{ marginBottom: 0 }}
              />

              {/* Phone Input */}
              <PickInput
                placeholder="Số điện thoại"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                iconBefore={<Icon name="call-outline" size={20} color="#666" />}
                containerStyle={{ marginBottom: 0 }}
              />

              {/* Password Input */}
              <PickInput
                placeholder="Mật khẩu"
                value={password}
                onChangeText={setPassword}
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
                containerStyle={{ marginBottom: 0 }}
              />

              {/* Confirm Password Input */}
              <PickInput
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
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
                containerStyle={{ marginBottom: 0 }}
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
                title="Đăng ký"
                onPress={handleRegister}
              />

              {/* Divider */}
              <PickView row alignCenter marginTop={8} marginBottom={8}>
                <PickView flex={1} height={1} backgroundColor="#e0e0e0" />
                <PickText size={14} style={{ color: "#999", marginHorizontal: 16 }}>
                  hoặc
                </PickText>
                <PickView flex={1} height={1} backgroundColor="#e0e0e0" />
              </PickView>

              {/* Social Register Buttons */}
              <PickView row justifyCenter gap={16} marginBottom={16}>
                <TouchableOpacity>
                  <PickView
                    width={56}
                    height={56}
                    borderRadius={28}
                    backgroundColor="#f5f5f5"
                    justifyCenter
                    alignCenter
                  >
                    <Icon name="logo-google" size={24} color="#DB4437" />
                  </PickView>
                </TouchableOpacity>
                <TouchableOpacity>
                  <PickView
                    width={56}
                    height={56}
                    borderRadius={28}
                    backgroundColor="#f5f5f5"
                    justifyCenter
                    alignCenter
                  >
                    <Icon name="logo-facebook" size={24} color="#4267B2" />
                  </PickView>
                </TouchableOpacity>
                <TouchableOpacity>
                  <PickView
                    width={56}
                    height={56}
                    borderRadius={28}
                    backgroundColor="#f5f5f5"
                    justifyCenter
                    alignCenter
                  >
                    <Icon name="logo-apple" size={24} color="#000" />
                  </PickView>
                </TouchableOpacity>
              </PickView>

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
    </PickView>
  );
};
