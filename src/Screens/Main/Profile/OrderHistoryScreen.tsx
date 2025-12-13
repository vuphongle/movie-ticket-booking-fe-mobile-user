import React, { useState, useCallback, useMemo } from "react";
import {
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { RootStackNavigationProp } from "@Types/navigationTypes";
import { PickText, PickView, ScalableButton } from "@Components";
import { OrderCard } from "@Components/OrderCard";

import useThemedStyles from "@Theme/Hook/useThemedStyles";
import { useOrderHistory, useOrderUtils } from "@Hooks";
import type { Order, OrderStatus } from "@Types/orderTypes";
import { useTranslation } from "@Hooks/useTranslation";

export const OrderHistoryScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<RootStackNavigationProp>();
  const { colors, spacing } = useThemedStyles();
  const { canViewPdf } = useOrderUtils();
  const { t } = useTranslation();

  const [selectedStatus, setSelectedStatus] = useState<
    OrderStatus | "ALL" | "UPCOMING" | "WATCHED"
  >("UPCOMING");

  const statusFilters: Array<{
    key: OrderStatus | "ALL" | "UPCOMING" | "WATCHED";
    label: string;
  }> = useMemo(
    () => [
      { key: "UPCOMING", label: t("ORDERS_FILTER_UPCOMING") },
      { key: "WATCHED", label: t("ORDERS_FILTER_WATCHED") },
      { key: "ALL", label: t("ORDERS_FILTER_ALL") },
      { key: "CONFIRMED", label: t("ORDERS_FILTER_CONFIRMED") },
      { key: "PENDING", label: t("ORDERS_FILTER_PENDING") },
      { key: "CANCELLED", label: t("ORDERS_FILTER_CANCELLED") },
      { key: "RETURNED", label: t("ORDERS_FILTER_RETURNED") },
    ],
    [t]
  );

  const { data: orders = [], isLoading, error, refetch, isRefetching } = useOrderHistory();

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleViewPdf = useCallback(
    async (order: Order) => {
      if (!canViewPdf(order) || !order.pdfPath) {
        Alert.alert(t("ORDERS_PDF_ALERT_TITLE"), t("ORDERS_PDF_UNAVAILABLE"));
        return;
      }

      try {
        const supported = await Linking.canOpenURL(order.pdfPath);
        if (supported) {
          await Linking.openURL(order.pdfPath);
        } else {
          Alert.alert(t("COMMON_ERROR"), t("ORDERS_PDF_OPEN_ERROR"));
        }
      } catch (error) {
        if (__DEV__) {
          console.error("Error opening PDF:", error);
        }
        Alert.alert(t("COMMON_ERROR"), t("ORDERS_PDF_OPEN_ERROR"));
      }
    },
    [canViewPdf, t]
  );

  const handleOrderPress = useCallback((order: Order) => {
    // TODO: Navigate to OrderDetailsScreen
    if (__DEV__) {
      console.log("Navigate to order details:", order.id);
    }
  }, []);

  // Filter orders based on selected status
  const filteredOrders = orders.filter((order) => {
    if (selectedStatus === "ALL") return true;

    if (selectedStatus === "UPCOMING") {
      // Show confirmed orders with future showtime
      if (order.status !== "CONFIRMED") return false;

      // Parse showtime date and time
      const [year, month, day] = order.showtime.date;
      const [hours, minutes] = order.showtime.startTime.split(":").map(Number);
      const showtimeDate = new Date(year, month - 1, day, hours, minutes);
      const now = new Date();
      return showtimeDate > now;
    }

    if (selectedStatus === "WATCHED") {
      // Show confirmed orders with past showtime
      if (order.status !== "CONFIRMED") return false;

      // Parse showtime date and time
      const [year, month, day] = order.showtime.date;
      const [hours, minutes] = order.showtime.startTime.split(":").map(Number);
      const showtimeDate = new Date(year, month - 1, day, hours, minutes);
      const now = new Date();
      return showtimeDate <= now;
    }

    return order.status === selectedStatus;
  });

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
          {t("ORDERS_ERROR_TITLE")}
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
              {t("ORDERS_ERROR_RETRY")}
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
              {t("ORDERS_SCREEN_TITLE")}
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
            {statusFilters.map((filter) => (
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
            <ActivityIndicator size="large" color={colors.background["bg-brand-quaternary"]} />
            <PickText size={16} style={{ marginTop: spacing.s16, color: colors.text.body }}>
              {t("ORDERS_LOADING_HISTORY")}
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
              {t("ORDERS_EMPTY_TITLE")}
            </PickText>
            <PickText size={14} color="body" style={{ textAlign: "center" }}>
              {selectedStatus === "ALL"
                ? t("ORDERS_EMPTY_MESSAGE_ALL")
                : selectedStatus === "UPCOMING"
                ? t("ORDERS_EMPTY_MESSAGE_UPCOMING")
                : selectedStatus === "WATCHED"
                ? t("ORDERS_EMPTY_MESSAGE_WATCHED")
                : t("ORDERS_EMPTY_MESSAGE_STATUS", {
                    status: statusFilters.find((f) => f.key === selectedStatus)?.label ?? "",
                  })}
            </PickText>
          </PickView>
        ) : (
          <>
            <PickText size={14} color="body" style={{ marginBottom: 16 }}>
              {t("ORDERS_COUNT_LABEL", { count: filteredOrders.length })}
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
