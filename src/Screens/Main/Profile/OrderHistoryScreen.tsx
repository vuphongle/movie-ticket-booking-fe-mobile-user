import React, { useState, useCallback } from "react";
import { ScrollView, RefreshControl, Alert, TouchableOpacity, Linking } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { RootStackNavigationProp } from "@Types/navigationTypes";
import { PickText, PickView, ScalableButton } from "@Components";
import { OrderCard } from "@Components/OrderCard";

import useThemedStyles from "@Theme/Hook/useThemedStyles";
import { useOrderHistory, useOrderUtils } from "@Hooks";
import type { Order, OrderStatus } from "@Types/orderTypes";

const ORDER_STATUS_FILTERS: Array<{ key: OrderStatus | "ALL"; label: string }> = [
  { key: "ALL", label: "Tất cả" },
  { key: "CONFIRMED", label: "Đã thanh toán" },
  { key: "PENDING", label: "Chờ thanh toán" },
  { key: "CANCELLED", label: "Đã hủy" },
  { key: "RETURNED", label: "Đã trả vé" },
];

export const OrderHistoryScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<RootStackNavigationProp>();
  const { colors } = useThemedStyles();
  const { canViewPdf } = useOrderUtils();

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "ALL">("ALL");

  const { data: orders = [], isLoading, error, refetch, isRefetching } = useOrderHistory();

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleViewPdf = useCallback(
    async (order: Order) => {
      if (!canViewPdf(order) || !order.pdfPath) {
        Alert.alert("Thông báo", "Hoá đơn PDF không khả dụng cho đơn hàng này");
        return;
      }

      try {
        const supported = await Linking.canOpenURL(order.pdfPath);
        if (supported) {
          await Linking.openURL(order.pdfPath);
        } else {
          Alert.alert("Lỗi", "Không thể mở file PDF");
        }
      } catch (error) {
        if (__DEV__) {
          console.error("Error opening PDF:", error);
        }
        Alert.alert("Lỗi", "Không thể mở file PDF");
      }
    },
    [canViewPdf]
  );

  const handleOrderPress = useCallback((order: Order) => {
    // TODO: Navigate to OrderDetailsScreen
    if (__DEV__) {
      console.log("Navigate to order details:", order.id);
    }
    Alert.alert("Thông báo", `Chi tiết đơn hàng #${order.id} (chưa implement)`);
  }, []);

  // Filter orders based on selected status
  const filteredOrders = orders.filter(
    (order) => selectedStatus === "ALL" || order.status === selectedStatus
  );

  if (error) {
    return (
      <PickView
        flex={1}
        backgroundColor={colors.background["bg-primary"]}
        justifyCenter
        alignCenter
        paddingHorizontal={20}
      >
        <Icon name="alert-circle-outline" size={64} color={colors.text["error-primary"]} />
        <PickText
          size={18}
          font="bold"
          color="error-primary"
          style={{ marginTop: 16, marginBottom: 8 }}
        >
          Có lỗi xảy ra
        </PickText>
        <PickText size={14} color="body" style={{ textAlign: "center", marginBottom: 24 }}>
          {error.message}
        </PickText>
        <ScalableButton onPress={onRefresh}>
          <PickView
            paddingHorizontal={24}
            paddingVertical={12}
            borderRadius={12}
            backgroundColor={colors.background["bg-brand-quaternary"]}
          >
            <PickText size={14} font="medium" color="body-inverted">
              Thử lại
            </PickText>
          </PickView>
        </ScalableButton>
      </PickView>
    );
  }

  return (
    <PickView flex={1} backgroundColor={colors.background["bg-primary"]}>
      {/* Fixed Header */}
      <PickView
        paddingHorizontal={20}
        paddingVertical={16}
        paddingTop={insets.top + 16}
        backgroundColor="white"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <PickView row alignCenter justifySpaceBetween>
          <PickView row alignCenter gap={12}>
            <ScalableButton onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color={colors.text["heading-primary"]} />
            </ScalableButton>
            <PickText size={20} font="bold" color="heading-primary">
              Lịch sử đặt vé
            </PickText>
          </PickView>
        </PickView>

        {/* Status Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 16 }}
        >
          <PickView row gap={8}>
            {ORDER_STATUS_FILTERS.map((filter) => (
              <TouchableOpacity key={filter.key} onPress={() => setSelectedStatus(filter.key)}>
                <PickView
                  paddingHorizontal={16}
                  paddingVertical={8}
                  borderRadius={20}
                  backgroundColor={
                    selectedStatus === filter.key
                      ? colors.background["bg-brand-quaternary"]
                      : colors.background["bg-secondary"]
                  }
                >
                  <PickText
                    size={13}
                    font="medium"
                    color={selectedStatus === filter.key ? "body-inverted" : "body"}
                  >
                    {filter.label}
                  </PickText>
                </PickView>
              </TouchableOpacity>
            ))}
          </PickView>
        </ScrollView>
      </PickView>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
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
        {isLoading ? (
          <PickView alignCenter paddingVertical={40}>
            <PickText size={14} color="body">
              Đang tải...
            </PickText>
          </PickView>
        ) : filteredOrders.length === 0 ? (
          <PickView alignCenter paddingVertical={60}>
            <Icon name="receipt-outline" size={64} color={colors.text["placeholder"]} />
            <PickText
              size={18}
              font="bold"
              color="heading-secondary"
              style={{ marginTop: 16, marginBottom: 8 }}
            >
              Chưa có đơn hàng nào
            </PickText>
            <PickText size={14} color="body" style={{ textAlign: "center" }}>
              {selectedStatus === "ALL"
                ? "Bạn chưa đặt vé nào. Hãy đặt vé xem phim ngay!"
                : `Không có đơn hàng nào với trạng thái "${
                    ORDER_STATUS_FILTERS.find((f) => f.key === selectedStatus)?.label
                  }"`}
            </PickText>
          </PickView>
        ) : (
          <>
            <PickText size={14} color="body" style={{ marginBottom: 16 }}>
              {filteredOrders.length} đơn hàng
            </PickText>

            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onPress={() => handleOrderPress(order)}
                onViewPdf={() => handleViewPdf(order)}
              />
            ))}
          </>
        )}
      </ScrollView>
    </PickView>
  );
};
