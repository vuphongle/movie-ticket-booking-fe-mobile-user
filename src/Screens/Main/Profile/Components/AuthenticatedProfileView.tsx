import React, { useCallback, useState } from "react";
import { ScrollView, TouchableOpacity, Alert, Image, RefreshControl } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { RootStackNavigationProp } from "@Types/navigationTypes";
import { PickText, PickView, ScalableButton } from "@Components";
import useThemedStyles from "@Theme/Hook/useThemedStyles";
import { useAuth } from "@Contexts/AuthContext";
import { useGetProfile } from "@Hooks";
import { getUserDisplayName, transformUserToUserInfo } from "@Utils";

interface MenuItem {
  icon: string;
  title: string;
  subtitle?: string;
  color: string;
  onPress?: () => void;
}

export const AuthenticatedProfileView: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<RootStackNavigationProp>();
  const { colors } = useThemedStyles();
  const { state, logout, updateUser } = useAuth();
  const { user } = state;

  const [avatarLoadError, setAvatarLoadError] = useState(false);

  const { refetch, isRefetching } = useGetProfile({
    enabled: false,
    onSuccess: async (fetchedUser) => {
      const updatedUserInfo = transformUserToUserInfo(fetchedUser);
      await updateUser(updatedUserInfo);

      if (__DEV__) {
        console.log("✅ Profile refreshed successfully");
      }
    },
    onError: (error) => {
      Alert.alert("Lỗi", `Không thể tải thông tin: ${error.message}`);
    },
  });

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleLogout = async () => {
    // Show confirmation dialog like web
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đăng xuất",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              Alert.alert("Thành công", "Đăng xuất thành công. Hẹn gặp lại bạn!");
            } catch (error) {
              Alert.alert("Lỗi", "Không thể đăng xuất. Vui lòng thử lại.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const menuItems: MenuItem[] = [
    {
      icon: "person-outline",
      title: "Thông tin cá nhân",
      subtitle: "Cập nhật thông tin tài khoản",
      color: "#6d5edc",
      onPress: () => navigation.navigate("EditProfile"),
    },
    {
      icon: "key-outline",
      title: "Đổi mật khẩu",
      subtitle: "Thay đổi mật khẩu đăng nhập",
      color: "#8b5cf6",
      onPress: () => navigation.navigate("ChangePassword"),
    },
    {
      icon: "ticket-outline",
      title: "Lịch sử đặt vé",
      subtitle: "Xem các vé đã đặt",
      color: "#2193b0",
      onPress: () => console.log("Order history"),
    },
    {
      icon: "star-outline",
      title: "Điểm thành viên",
      subtitle: "Tích điểm và ưu đãi",
      color: "#ffd700",
      onPress: () => console.log("Member points"),
    },
    {
      icon: "card-outline",
      title: "Phương thức thanh toán",
      subtitle: "Quản lý thẻ và ví",
      color: "#4ecdc4",
      onPress: () => console.log("Payment methods"),
    },
    {
      icon: "notifications-outline",
      title: "Thông báo",
      subtitle: "Cài đặt thông báo",
      color: "#ff6b6b",
      onPress: () => console.log("Notifications"),
    },
    {
      icon: "settings-outline",
      title: "Cài đặt",
      subtitle: "Cài đặt ứng dụng",
      color: "#95a5a6",
      onPress: () => console.log("Settings"),
    },
  ];

  return (
    <PickView flex={1} backgroundColor={colors.background["bg-primary"]}>
      {/* Fixed Header */}
      <PickView
        paddingHorizontal={20}
        paddingVertical={24}
        paddingTop={insets.top + 16}
        backgroundColor={colors.background["bg-brand-quaternary"]}
      >
        <PickView row alignCenter gap={16}>
          <PickView
            width={80}
            height={80}
            borderRadius={40}
            justifyCenter
            alignCenter
            backgroundColor="white"
            style={{ overflow: "hidden" }}
          >
            {user?.avatar && !user.avatar.includes(".svg") && !avatarLoadError ? (
              <Image
                source={{ uri: user.avatar }}
                style={{ width: 80, height: 80 }}
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
              <Icon name="person" size={40} color="#6d5edc" />
            )}
          </PickView>

          <PickView flex={1}>
            <PickText size={24} font="bold" color="body-inverted" numberOfLines={1} lineHeight={30}>
              {getUserDisplayName(user)}
            </PickText>
            <PickText size={14} color="body-inverted" numberOfLines={1} style={{ marginTop: 4 }}>
              {user?.email || ""}
            </PickText>
          </PickView>

          <ScalableButton onPress={() => navigation.navigate("EditProfile")}>
            <PickView
              width={40}
              height={40}
              borderRadius={20}
              justifyCenter
              alignCenter
              backgroundColor="rgba(255,255,255,0.2)"
            >
              <Icon name="create-outline" size={20} color="#fff" />
            </PickView>
          </ScalableButton>
        </PickView>
      </PickView>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            tintColor={colors.background["bg-brand-quaternary"]}
            colors={[colors.background["bg-brand-quaternary"]]}
          />
        }
      >
        {/* Menu Items */}
        <PickView
          paddingHorizontal={20}
          paddingTop={20}
          backgroundColor={colors.background["bg-primary"]}
        >
          <PickText size={18} font="bold" style={{ color: "#1a1a2e", marginBottom: 16 }}>
            Tài khoản của tôi
          </PickText>

          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} onPress={item.onPress}>
              <PickView
                row
                alignCenter
                backgroundColor="white"
                padding={16}
                borderRadius={12}
                marginBottom={12}
              >
                <PickView
                  width={48}
                  height={48}
                  borderRadius={12}
                  justifyCenter
                  alignCenter
                  marginRight={16}
                  backgroundColor={item.color + "20"}
                >
                  <Icon name={item.icon} size={24} color={item.color} />
                </PickView>

                <PickView flex={1}>
                  <PickText size={16} font="semibold" style={{ color: "#1a1a2e", marginBottom: 2 }}>
                    {item.title}
                  </PickText>
                  {item.subtitle && (
                    <PickText size={13} style={{ color: "#666" }}>
                      {item.subtitle}
                    </PickText>
                  )}
                </PickView>

                <Icon name="chevron-forward" size={20} color="#999" />
              </PickView>
            </TouchableOpacity>
          ))}

          <TouchableOpacity onPress={handleLogout}>
            <PickView
              row
              justifyCenter
              alignCenter
              gap={8}
              backgroundColor={colors.background["bg-error-quarternary"]}
              padding={16}
              borderRadius={12}
              marginTop={20}
            >
              <Icon name="log-out-outline" size={20} color={colors.icon["icon-on-fill"]} />
              <PickText size={16} font="semibold" color="body-on-brand">
                Đăng xuất
              </PickText>
            </PickView>
          </TouchableOpacity>
        </PickView>
      </ScrollView>
    </PickView>
  );
};
