import React from "react";
import { View } from "react-native";
import { PickView, PickText } from "@Components";
import { formatCurrency } from "@Utils/currencyUtils";
import { SPACING, FONT_SIZE } from "@Constants/theme";
import { useTranslation } from "@Hooks/useTranslation";

interface Seat {
  id: number;
  row: string;
  number: number;
  price: number;
}

interface TicketListProps {
  seats: Seat[];
}

const TicketList: React.FC<TicketListProps> = ({ seats }) => {
  const { t } = useTranslation();
  return (
    <PickView
      style={{
        marginTop: SPACING.xs,
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
        {t("BOOKING_TICKETS_TITLE")}
      </PickText>

      {seats.map((seat) => (
        <View
          key={seat.id}
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
            {t("BOOKING_TICKETS_SEAT_LABEL", {
              seatRow: seat.row,
              seatNumber: seat.number,
            })}
          </PickText>
          <PickText style={{ fontSize: FONT_SIZE.md, fontWeight: "700", color: "#012e6e" }}>
            {formatCurrency(seat.price)}
          </PickText>
        </View>
      ))}
    </PickView>
  );
};

export default TicketList;
