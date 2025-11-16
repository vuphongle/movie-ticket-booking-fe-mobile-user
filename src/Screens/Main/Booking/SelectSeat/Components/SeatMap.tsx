import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { PickView, PickText } from "@Components";
import SeatItem from "./SeatItem";
import { Seat } from "./utils";

interface SeatMapProps {
  seats: Seat[];
  selectedSeats: Seat[];
  onSelectSeat: (seat: Seat) => void;
}

const SeatMap: React.FC<SeatMapProps> = ({ seats, selectedSeats, onSelectSeat }) => {
  const rows = useMemo(() => Array.from(new Set(seats.map((s) => s.row))).sort(), [seats]);
  const maxSeatsInRow = useMemo(() => {
    return Math.max(...rows.map((row) => seats.filter((s) => s.row === row).length));
  }, [rows, seats]);

  return (
    <PickView style={styles.container}>
      {rows.map((row) => {
        const seatsInRow = seats.filter((s) => s.row === row).sort((a, b) => a.number - b.number);
        const emptySpaces = maxSeatsInRow - seatsInRow.length;
        const sideMargin = (emptySpaces * 34) / 2;

        return (
          <PickView key={row} style={styles.row}>
            <PickText style={styles.rowLabel}>{row}</PickText>
            <View style={{ flexDirection: "row", marginLeft: sideMargin }}>
              {seatsInRow.map((seat) => (
                <SeatItem
                  key={seat.id}
                  seat={seat}
                  selected={selectedSeats.some((s) => s.id === seat.id)}
                  onPress={onSelectSeat}
                />
              ))}
            </View>
          </PickView>
        );
      })}
    </PickView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 1,
  },
  rowLabel: {
    width: 20,
    textAlign: "center",
    marginRight: 3,
    fontWeight: "600",
    color: "white",
  },
});

export default SeatMap;
