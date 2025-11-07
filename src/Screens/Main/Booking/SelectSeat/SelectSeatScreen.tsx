import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { PickView, PickText, PickButton, ScreenHeader } from "@Components";
import { useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SeatMap from "./Components/SeatMap";
import SeatLegend from "./Components/SeatLegend";
import { Seat, mapSeatStatus, mapSeatType, mapReservationStatus } from "./Components/utils";
import { useSeats } from "@Hooks/booking/useSeats";
import { COLORS, SPACING, FONT_SIZE } from "@Constants/theme";
import { formatCurrency } from "@Utils/currencyUtils";

const SelectSeatScreen: React.FC = () => {
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { showtimeId, auditorium } = route.params;
  const auditoriumId = auditorium.id;

  const { seats: seatDtos, isLoading: isSeatsLoading } = useSeats({
    auditoriumId,
    showtimeId,
  });

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  useEffect(() => {
    if (!seatDtos.length) return;

    const mappedSeats = seatDtos.map((d) => ({
      id: d.id,
      row: d.code?.charAt(0) || "A",
      number: Number(d.code?.slice(1)) || d.colIndex,
      type: mapSeatType(d.type),
      status: mapSeatStatus(d.status, d.reservationStatus),
      reservationStatus: mapReservationStatus(d.reservationStatus),
      price: d.price,
    }));

    setSeats((prev) => {
      const isEqual =
        prev.length === mappedSeats.length &&
        prev.every((s, i) => s.id === mappedSeats[i].id && s.status === mappedSeats[i].status);
      return isEqual ? prev : mappedSeats;
    });
  }, [seatDtos]);

  const toggleSeat = async (seat: Seat) => {
    if (seat.status === "booked") return;

    try {
      const isSelected = selectedSeats.some((s) => s.id === seat.id);

      if (isSelected) {
        setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
        return;
      }

      if (selectedSeats.length >= 8) {
        Alert.alert("Giới hạn", "Bạn chỉ được chọn tối đa 8 ghế.");
        return;
      }

      setSelectedSeats((prev) => [...prev, seat]);
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể kiểm tra trạng thái ghế.");
    }
  };

  // Đặt ghế
  const handleBookSeats = async () => {
    if (!selectedSeats.length) {
      Alert.alert("Chọn ghế", "Vui lòng chọn ít nhất 1 ghế.");
      return;
    }

    Alert.alert("Tính năng đang được phát triển tiếp. Xin quý khách thông cảm!");
  };

  const totalPrice = selectedSeats.reduce((s, x) => s + x.price, 0);

  if (isSeatsLoading)
    return (
      <PickView style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </PickView>
    );

  return (
    <PickView>
      <ScreenHeader title="Chọn ghế" />

      <PickView>
        <PickView style={styles.screen}>
          <PickText style={styles.screenText}>MÀN HÌNH</PickText>
        </PickView>

        <ScrollView
          contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
          showsVerticalScrollIndicator={false}
        >
          <SeatMap seats={seats} selectedSeats={selectedSeats} onSelectSeat={toggleSeat} />
          <SeatLegend />
        </ScrollView>

        <PickView style={[styles.summary, { paddingBottom: insets.bottom }]}>
          <PickView style={styles.summaryLeft}>
            <PickText style={styles.summaryText}>
              Ghế đã chọn:{" "}
              {selectedSeats.length
                ? selectedSeats.map((s) => `${s.row}${s.number}`).join(", ")
                : "Chưa có"}
            </PickText>
            <PickText style={styles.summaryText}>Tổng: {formatCurrency(totalPrice)}</PickText>
          </PickView>

          <PickButton
            title="Tiếp tục"
            type="Primary"
            onPress={handleBookSeats}
            style={styles.continueButton}
            textStyle={{ fontSize: FONT_SIZE.sm }}
          />
        </PickView>
      </PickView>
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
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  screen: {
    height: 50,
    marginHorizontal: SPACING.md,
    marginVertical: 12,
    borderRadius: 30,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,

    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderTopColor: "rgba(255,255,255,0.7)",
    borderBottomColor: "rgba(0,0,0,0.15)",

    transform: [{ perspective: 500 }, { rotateX: "10deg" }],
  },
  screenText: {
    fontWeight: "700",
    color: "#222",
    letterSpacing: 1,
    fontSize: FONT_SIZE.md,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
  },
  continueButton: {
    width: 100,
    height: 36,
    borderRadius: 4,
  },
});

export default SelectSeatScreen;
