import React from "react";
import { View } from "react-native";
import { PickView, PickText } from "@Components";
import { formatCurrency } from "@Utils/currencyUtils";
import { SPACING, FONT_SIZE } from "@Constants/theme";
import { useTranslation } from "@Hooks/useTranslation";

interface ServiceItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface ServiceListProps {
  services: ServiceItem[];
}

const ServiceList: React.FC<ServiceListProps> = ({ services }) => {
  const { t } = useTranslation();
  const selectedServices = services.filter((s) => s.quantity > 0);
  if (!selectedServices.length) return null;

  return (
    <PickView
      style={{
        marginTop: SPACING.md,
        backgroundColor: "#FFF",
        borderRadius: 16,
        padding: SPACING.md,
        shadowColor: "#00000010",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <PickText
        style={{
          fontWeight: "bold",
          fontSize: FONT_SIZE.lg,
          marginBottom: SPACING.sm,
          color: "#012e6e",
        }}
      >
        {t("BOOKING_SERVICES_TITLE")}
      </PickText>

      {selectedServices.map((s) => (
        <View
          key={s.id}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: "#E0E0E0",
          }}
        >
          <PickText style={{ fontSize: FONT_SIZE.md, fontWeight: "500", color: "#2B2B2B" }}>
            {s.name} x{s.quantity}
          </PickText>
          <PickText style={{ fontSize: FONT_SIZE.md, fontWeight: "700", color: "#012e6e" }}>
            {formatCurrency(s.price * s.quantity)}
          </PickText>
        </View>
      ))}
    </PickView>
  );
};

export default ServiceList;
