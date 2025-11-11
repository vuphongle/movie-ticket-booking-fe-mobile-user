import React from "react";
import { PickText, PickView } from "@Components";
import type { Order } from "@Types/orderTypes";
import { useOrderUtils } from "@Hooks";

interface OrderStatusBadgeProps {
  status: Order["status"];
  size?: "small" | "medium";
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, size = "medium" }) => {
  const { getOrderStatusConfig } = useOrderUtils();
  const config = getOrderStatusConfig(status);

  const isSmall = size === "small";

  return (
    <PickView
      paddingHorizontal={isSmall ? 8 : 12}
      paddingVertical={isSmall ? 4 : 6}
      borderRadius={isSmall ? 8 : 12}
      backgroundColor={config.bgColor}
      alignSelf="flex-start"
    >
      <PickText size={isSmall ? 11 : 12} font="semibold" style={{ color: config.color }}>
        {config.label}
      </PickText>
    </PickView>
  );
};
