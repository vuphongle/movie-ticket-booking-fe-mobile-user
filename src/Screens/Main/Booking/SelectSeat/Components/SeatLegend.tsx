import React from "react";
import { StyleSheet } from "react-native";
import { PickView, PickText } from "@Components";
import { SPACING, COLORS, FONT_SIZE } from "@Constants/theme";
import { useTranslation } from "@Hooks/useTranslation";

const SeatLegend: React.FC = () => {
  const { t } = useTranslation();

  const legendItems = [
    { color: "#7e57c2", label: t("BOOKING_SEAT_LEGEND_STANDARD"), borderColor: "#5e35b1" },
    { color: "#fbc02d", label: t("BOOKING_SEAT_LEGEND_VIP"), borderColor: "#f9a825" },
    { color: "#ff4081", label: t("BOOKING_SEAT_LEGEND_DOUBLE"), borderColor: "#f50057" },
    { color: "#d32f2f", label: t("BOOKING_SEAT_LEGEND_BOOKED"), borderColor: "#9a0007" },
    { color: "#1976d2", label: t("BOOKING_SEAT_LEGEND_SELECTED"), borderColor: "#115293" },
  ];

  return (
    <PickView style={styles.legend}>
      {legendItems.map((item, index) => (
        <PickView key={index} style={styles.legendItem}>
          <PickView
            style={[
              styles.legendColor,
              { backgroundColor: item.color, borderColor: item.borderColor },
            ]}
          />
          <PickText style={styles.legendLabel}>{item.label}</PickText>
        </PickView>
      ))}
    </PickView>
  );
};

const styles = StyleSheet.create({
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginVertical: 5,
    backgroundColor: "transparent",
    borderRadius: 8,
    width: 440,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  legendColor: {
    width: 18,
    height: 18,
    borderWidth: 2,
    marginRight: 6,
  },

  legendLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "bold",
    color: COLORS.text.white,
  },
});
export default SeatLegend;
