import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { PickView, PickText } from "@Components";
import { Seat } from "./utils";

interface SeatItemProps {
  seat: Seat;
  selected: boolean;
  onPress: (seat: Seat) => void;
}

const SeatItem: React.FC<SeatItemProps> = ({ seat, selected, onPress }) => {
  const inactive = seat.status === "inactive";

  const bgColor = inactive
    ? "transparent"
    : seat.status === "booked"
    ? "#d32f2f"
    : selected
    ? "#1976d2"
    : seat.type === "vip"
    ? "#fbc02d"
    : seat.type === "couple"
    ? "#ff4081"
    : "#7e57c2";

  const textColor = inactive
    ? "transparent"
    : bgColor === "#fbc02d" || bgColor === "#ff4081"
    ? "#000"
    : "#fff";

  const borderColor = inactive
    ? "transparent"
    : seat.type === "vip"
    ? "#f9a825"
    : seat.type === "couple"
    ? "#f50057"
    : "#5e35b1";

  return (
    <TouchableOpacity
      style={[styles.seat, { backgroundColor: bgColor, borderColor }]}
      onPress={() => onPress(seat)}
      disabled={seat.status === "booked" || inactive}
    >
      <PickView style={styles.center}>
        <PickText style={[styles.seatText, { color: textColor }]}>
          {`${seat.row}${seat.number}`}
        </PickText>
      </PickView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  seat: {
    width: 32,
    height: 32,
    margin: 1,
    borderRadius: 2,
    borderWidth: 2,
  },
  seatText: {
    fontSize: 14,
    fontWeight: "700",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SeatItem;
