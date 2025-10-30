import React from "react";
import { ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@Types/navigationTypes";
import Icon from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PickButton, PickText, PickView } from "@Components";
import useThemedStyles from "@Theme/Hook/useThemedStyles";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
}

const FEATURES: Feature[] = [
  {
    icon: "person-circle-outline",
    title: "Quản lý thông tin",
    description: "Cập nhật và quản lý thông tin cá nhân của bạn",
    color: "#6d5edc",
  },
  {
    icon: "ticket-outline",
    title: "Lịch sử mua vé",
    description: "Xem lại tất cả các vé đã đặt và trạng thái",
    color: "#2193b0",
  },
  {
    icon: "star-outline",
    title: "Thành viên VIP",
    description: "Tích điểm và nhận ưu đãi độc quyền",
    color: "#ffd700",
  },
  {
    icon: "gift-outline",
    title: "Ưu đãi đặc biệt",
    description: "Nhận thông báo về các chương trình khuyến mãi",
    color: "#ff6b6b",
  },
  {
    icon: "card-outline",
    title: "Thanh toán nhanh",
    description: "Lưu thông tin thanh toán để đặt vé dễ dàng",
    color: "#4ecdc4",
  },
];

export const GuestProfileView: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { colors, dimensions } = useThemedStyles();
  const screenWidth = dimensions.width;
  const buttonWidth = (screenWidth - 32 - 16) / 2;

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <PickView flex={1} backgroundColor={colors.background["bg-primary"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 100,
          backgroundColor: colors.background["bg-primary"],
        }}
        showsVerticalScrollIndicator={false}
      >
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
              Chào mừng đến GoCinema
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
              Đăng nhập để trải nghiệm đầy đủ tính năng
            </PickText>
          </PickView>

          <PickView row gap={16}>
            <PickButton
              style={{ marginTop: 8, alignSelf: "center", width: buttonWidth }}
              type="Tertiary"
              size="sm"
              title="Đăng nhập"
              onPress={handleLogin}
            />
            <PickButton
              style={{ marginTop: 8, alignSelf: "center", width: buttonWidth }}
              type="Tertiary"
              size="sm"
              title="Đăng ký"
              onPress={handleRegister}
            />
          </PickView>
        </PickView>

        <PickView paddingHorizontal={20} paddingTop={30}>
          <PickText size={24} font="bold" style={{ color: "#1a1a2e", marginBottom: 8 }}>
            Tính năng khi đăng nhập
          </PickText>
          <PickText size={14} style={{ color: "#666", marginBottom: 20 }}>
            Tận hưởng trải nghiệm xem phim tốt nhất
          </PickText>

          {FEATURES.map((feature, index) => (
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
            Đã có tài khoản?{" "}
            <PickText size={14} font="semibold" onPress={handleLogin} style={{ color: "#6d5edc" }}>
              Đăng nhập ngay
            </PickText>
          </PickText>
        </PickView>
      </ScrollView>
    </PickView>
  );
};
