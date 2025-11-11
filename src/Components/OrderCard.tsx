import React from "react";
import { TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { PickText, PickView, ScalableButton } from "@Components";
import { OrderStatusBadge } from "@Components/OrderStatusBadge";
import useThemedStyles from "@Theme/Hook/useThemedStyles";
import { useOrderUtils } from "@Hooks";
import { formatCurrency } from "@Utils/currencyUtils";
import type { Order } from "@Types/orderTypes";

interface OrderCardProps {
  order: Order;
  onPress: () => void;
  onViewPdf?: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onPress, onViewPdf }) => {
  const { colors } = useThemedStyles();
  const { getOrderSummary, formatOrderDate, canViewPdf } = useOrderUtils();

  const summary = getOrderSummary(order);
  const canShowPdf = canViewPdf(order);

  return (
    <TouchableOpacity onPress={onPress}>
      <PickView
        backgroundColor="white"
        borderRadius={16}
        padding={16}
        style={{
          marginBottom: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        {/* Header với poster và thông tin cơ bản */}
        <PickView row gap={12} style={{ marginBottom: 12 }}>
          <PickView
            width={60}
            height={80}
            borderRadius={8}
            backgroundColor={colors.background["bg-secondary"]}
            style={{ overflow: "hidden" }}
          >
            <Image
              source={{ uri: order.showtime.movie.poster }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </PickView>

          <PickView flex={1} justifyContent="space-between">
            <PickView>
              <PickText
                size={16}
                font="bold"
                color="heading-primary"
                numberOfLines={2}
                lineHeight={20}
                style={{ marginBottom: 4 }}
              >
                {summary.movieName}
              </PickText>

              <PickText size={13} color="body" style={{ marginBottom: 2 }}>
                {summary.cinemaName}
              </PickText>

              <PickText size={13} color="body">
                {summary.auditoriumName}
              </PickText>
            </PickView>

            <OrderStatusBadge status={order.status} size="small" />
          </PickView>
        </PickView>

        {/* Thông tin chi tiết */}
        <PickView
          paddingVertical={12}
          borderTopWidth={1}
          borderTopColor={colors.border["border-tertiary"]}
          gap={8}
        >
          <PickView row justifySpaceBetween alignCenter>
            <PickText size={13} color="body">
              Suất chiếu:
            </PickText>
            <PickText size={13} font="medium" color="heading-primary">
              {summary.showTime} - {summary.showDate}
            </PickText>
          </PickView>

          <PickView row justifySpaceBetween alignCenter>
            <PickText size={13} color="body">
              Ghế:
            </PickText>
            <PickText size={13} font="medium" color="heading-primary">
              {summary.seatCodes.join(", ")}
            </PickText>
          </PickView>

          <PickView row justifySpaceBetween alignCenter>
            <PickText size={13} color="body">
              Số vé:
            </PickText>
            <PickText size={13} font="medium" color="heading-primary">
              {summary.totalTickets} vé
            </PickText>
          </PickView>

          {summary.totalServices > 0 && (
            <PickView row justifySpaceBetween alignCenter>
              <PickText size={13} color="body">
                Dịch vụ:
              </PickText>
              <PickText size={13} font="medium" color="heading-primary">
                {summary.totalServices} món
              </PickText>
            </PickView>
          )}

          <PickView row justifySpaceBetween alignCenter>
            <PickText size={13} color="body">
              Ngày đặt:
            </PickText>
            <PickText size={13} font="medium" color="body">
              {formatOrderDate(order.createdAt)}
            </PickText>
          </PickView>
        </PickView>

        {/* Footer với giá và actions */}
        <PickView
          row
          justifySpaceBetween
          alignCenter
          paddingTop={12}
          borderTopWidth={1}
          borderTopColor={colors.border["border-tertiary"]}
        >
          <PickView>
            <PickText size={18} font="bold" color="heading-primary">
              {formatCurrency(order.totalPrice)}
            </PickText>
            {order.discount > 0 && (
              <PickText size={11} color="sub-headline-brand">
                Tiết kiệm {formatCurrency(order.discount)}
              </PickText>
            )}
          </PickView>

          <PickView row gap={8}>
            {canShowPdf && onViewPdf && (
              <ScalableButton onPress={onViewPdf}>
                <PickView
                  paddingHorizontal={12}
                  paddingVertical={8}
                  borderRadius={8}
                  backgroundColor={colors.background["bg-brand-quaternary"]}
                  row
                  alignCenter
                  gap={4}
                >
                  <Icon name="document-text-outline" size={16} color="white" />
                  <PickText size={12} font="medium" color="body-inverted">
                    PDF
                  </PickText>
                </PickView>
              </ScalableButton>
            )}
          </PickView>
        </PickView>
      </PickView>
    </TouchableOpacity>
  );
};
