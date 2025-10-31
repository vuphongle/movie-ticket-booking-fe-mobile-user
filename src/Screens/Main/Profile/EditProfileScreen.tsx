import React, { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Icon from "react-native-vector-icons/Ionicons";
import { PickText, PickView, PickFormInput, DatePickerModal, ScreenHeader } from "@Components";
import useThemedStyles from "@Theme/Hook/useThemedStyles";
import { useAuth } from "@Contexts/AuthContext";
import { useUpdateProfile } from "@Hooks";
import { updateProfileSchema, type UpdateProfileFormData } from "@Schemas/profileSchemas";
import {
  toISODate,
  toDisplayDate,
  parseISODate,
  getUserPhone,
  getUserDob,
  transformUserToUserInfo,
} from "@Utils";
import type { UpdateProfileRequest } from "@Types/authTypes";

export const EditProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors } = useThemedStyles();
  const { state, updateUser } = useAuth();
  const { user } = state;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [avatarLoadError, setAvatarLoadError] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isDirty },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name || "",
      phone: getUserPhone(user),
      dob: parseISODate(getUserDob(user)) || new Date(2000, 0, 1),
    },
  });

  const dobValue = watch("dob");

  const { mutate: updateProfile, isPending } = useUpdateProfile({
    onSuccess: async (updatedUser) => {
      const updatedUserInfo = transformUserToUserInfo(updatedUser);

      await updateUser(updatedUserInfo);

      Alert.alert("Thành công", "Cập nhật thông tin thành công!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    },
  });

  const onSubmit = (data: UpdateProfileFormData) => {
    if (!user) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng");
      return;
    }

    const payload: UpdateProfileRequest = {
      name: data.name.trim(),
      phone: data.phone,
      dob: toISODate(data.dob),
      avatar: user.avatar,
    };

    updateProfile(payload);
  };

  const handleDateConfirm = (date: Date) => {
    setValue("dob", date, { shouldValidate: true, shouldDirty: true });
    setShowDatePicker(false);
  };

  if (!user) {
    return (
      <PickView
        flex={1}
        justifyCenter
        alignCenter
        backgroundColor={colors.background["bg-primary"]}
      >
        <PickText size={16} style={{ color: "#666" }}>
          Không tìm thấy thông tin người dùng
        </PickText>
      </PickView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <PickView flex={1} backgroundColor={colors.background["bg-primary"]}>
        {/* Header */}
        <ScreenHeader
          title="Chỉnh sửa thông tin"
          backgroundColor={colors.background["bg-brand-quaternary"]}
        />

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
          {/* Avatar Section */}
          <PickView alignCenter marginBottom={32}>
            <PickView
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: colors.background["bg-brand-quaternary"],
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              {user?.avatar && !user.avatar.includes(".svg") && !avatarLoadError ? (
                <Image
                  source={{ uri: user.avatar }}
                  style={{ width: 100, height: 100 }}
                  resizeMode="cover"
                  onError={(error) => {
                    if (__DEV__) {
                      console.log("⚠️ Avatar load failed:", user.avatar);
                      console.log("Error:", error.nativeEvent.error);
                    }
                    setAvatarLoadError(true);
                  }}
                />
              ) : (
                <Icon name="person" size={50} color="white" />
              )}
            </PickView>
            <TouchableOpacity style={{ marginTop: 12 }}>
              <PickText size={14} font="semibold" style={{ color: "#6d5edc" }}>
                Thay đổi ảnh đại diện
              </PickText>
            </TouchableOpacity>
          </PickView>

          {/* Form Fields */}
          <PickView>
            {/* Name Input */}
            <PickFormInput
              control={control}
              name="name"
              label="Họ và tên"
              placeholder="Nhập họ và tên"
              autoCapitalize="words"
              iconBefore={<Icon name="person-outline" size={20} color="#666" />}
            />

            {/* Email Display (Read-only) */}
            <PickView marginBottom={16}>
              <PickText size={14} font="semibold" style={{ color: "#1a1a2e", marginBottom: 8 }}>
                Email
              </PickText>
              <PickView
                paddingHorizontal={16}
                paddingVertical={14}
                borderRadius={12}
                backgroundColor="#f5f5f5"
                row
                alignCenter
                gap={12}
                style={{
                  borderWidth: 1,
                  borderColor: "#e0e0e0",
                }}
              >
                <Icon name="mail-outline" size={20} color="#666" />
                <PickText size={16} style={{ color: "#666", flex: 1 }}>
                  {user?.email || "Chưa có email"}
                </PickText>
              </PickView>
            </PickView>

            {/* Phone Input */}
            <PickFormInput
              control={control}
              name="phone"
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
              iconBefore={<Icon name="call-outline" size={20} color="#666" />}
            />

            {/* Date of Birth */}
            <PickView>
              <PickText size={14} font="semibold" style={{ color: "#1a1a2e", marginBottom: 8 }}>
                Ngày sinh
              </PickText>
              <Controller
                control={control}
                name="dob"
                render={({ field: { value }, fieldState: { error } }) => (
                  <>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                      <PickView
                        paddingHorizontal={16}
                        paddingVertical={14}
                        borderRadius={12}
                        backgroundColor="white"
                        row
                        alignCenter
                        gap={12}
                        style={{
                          borderWidth: 1,
                          borderColor: error ? colors.border["border-error"] : "#e0e0e0",
                        }}
                      >
                        <Icon name="calendar-outline" size={20} color="#666" />
                        <PickText size={16} style={{ color: "#1a1a2e", flex: 1 }}>
                          {toDisplayDate(value)}
                        </PickText>
                        <Icon name="chevron-down" size={20} color="#999" />
                      </PickView>
                    </TouchableOpacity>
                    {error && (
                      <PickText size={12} style={{ color: "#ef4444", marginTop: 4 }}>
                        {error.message}
                      </PickText>
                    )}
                  </>
                )}
              />
            </PickView>
          </PickView>
        </ScrollView>

        {/* Save Button */}
        <PickView
          paddingHorizontal={20}
          paddingTop={16}
          paddingBottom={insets.bottom + 16}
          backgroundColor="white"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
          }}
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
                  Đang cập nhật...
                </PickText>
              ) : (
                <PickText size={16} font="semibold" color="body-inverted">
                  Lưu thay đổi
                </PickText>
              )}
            </PickView>
          </TouchableOpacity>
        </PickView>

        {/* Date Picker Modal */}
        <DatePickerModal
          visible={showDatePicker}
          value={dobValue}
          onConfirm={handleDateConfirm}
          onCancel={() => setShowDatePicker(false)}
          minimumDate={new Date(1900, 0, 1)}
          maximumDate={new Date()}
        />
      </PickView>
    </KeyboardAvoidingView>
  );
};
