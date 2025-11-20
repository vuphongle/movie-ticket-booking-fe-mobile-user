import React from "react";
import { StyleSheet } from "react-native";
import { PickView, PickText, PickButton } from "@Components";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBookingStore } from "@Store/useBookingStore";
import { formatCurrency } from "@Utils/currencyUtils";
import { COLORS, SPACING, FONT_SIZE } from "@Constants/theme";

interface BookingSummaryProps {
  onContinue?: () => void;
  isPending?: boolean;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ onContinue, isPending }) => {
  const { seats, totalPrice } = useBookingStore();
  const insets = useSafeAreaInsets();

  return (
    <PickView style={[styles.summary, { paddingBottom: insets.bottom }]}>
      <PickView style={styles.summaryLeft}>
        <PickText style={styles.summaryText}>
          Ghế đã chọn:{" "}
          {seats.length ? seats.map((s) => `${s.row}${s.number}`).join(", ") : "Chưa chọn"}
        </PickText>

        <PickText style={styles.totalText}>Tổng tiền: {formatCurrency(totalPrice)}</PickText>
      </PickView>

      <PickButton
        title={isPending ? "Đang xử lý..." : "Tiếp tục"}
        type="Primary"
        onPress={onContinue}
        disabled={isPending}
        style={styles.continueButton}
        textStyle={{ fontSize: FONT_SIZE.sm }}
      />
    </PickView>
  );
};

const styles = StyleSheet.create({
  summary: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderColor: "#ccc",
    height: 80,
  },
  summaryLeft: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    maxWidth: "70%",
  },
  summaryText: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    marginRight: SPACING.lg,
    color: COLORS.text.primary,
  },
  totalText: {
    fontSize: FONT_SIZE.md,
    fontWeight: "800",
    color: COLORS.accent,
  },
  continueButton: {
    width: 100,
    height: 36,
    borderRadius: 4,
  },
});

export default BookingSummary;
