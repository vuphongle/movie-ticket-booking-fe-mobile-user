import React from "react";
import { StyleSheet } from "react-native";
import { PickView, PickText } from "@Components";
import { SPACING, COLORS, FONT_SIZE } from "@Constants/theme";

const SeatLegend: React.FC = () => {
  const legendItems = [
    { color: "#7e57c2", label: "Ghế thường", borderColor: "#5e35b1" },
    { color: "#fbc02d", label: "Ghế VIP", borderColor: "#f9a825" },
    { color: "#ff4081", label: "Ghế đôi", borderColor: "#f50057" },
    { color: "#1976d2", label: "Ghế đang chọn", borderColor: "#115293" },
    { color: "#d32f2f", label: "Ghế đã đặt", borderColor: "#9a0007" },
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
    justifyContent: "flex-start",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginVertical: 5,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 6,
  },

  legendLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.primary,
  },
});
export default SeatLegend;
