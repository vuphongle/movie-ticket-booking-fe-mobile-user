import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ImageBackground,
  View,
} from "react-native";
import { PickView, PickText, ScreenHeader } from "@Components";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SeatMap from "./Components/SeatMap";
import SeatLegend from "./Components/SeatLegend";
import SeatMapZoomable from "./Components/SeatMapZoomable";
import { Seat, mapSeatStatus, mapSeatType, mapReservationStatus } from "./Components/utils";
import { useSeats } from "@Hooks/booking/useSeats";
import { useBookSeat, useLazyCheckSeatStatus } from "@Hooks/booking/useReservation";
import { useMovieByShowtime } from "@Hooks";
import { formatDate } from "@Utils";
import { COLORS, SPACING } from "@Constants/theme";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@Types/navigationTypes";
import { useBookingStore } from "@Store/useBookingStore";
import BookingSummary from "@Screens/Main/Booking/BaseComponents/BookingSummary";
import Svg, { Path } from "react-native-svg";

type NavProp = NativeStackNavigationProp<RootStackParamList, "AdditionalService">;

const SelectSeatScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<NavProp>();
  const insets = useSafeAreaInsets();
  const { showtimeId, cinema, auditorium, time, date, format } = route.params;
  const auditoriumId = auditorium.id;
  const { movie, isLoading } = useMovieByShowtime(showtimeId);

  const {
    seats: seatDtos,
    isLoading: isSeatsLoading,
    refetch: refetchSeats,
  } = useSeats({ auditoriumId, showtimeId });
  const { addSeat, removeSeat, setBookingInfo, seats, setExpireTime } = useBookingStore();
  const checkSeatStatus = useLazyCheckSeatStatus();
  const { mutateAsync: bookSeat } = useBookSeat();

  const [mappedSeats, setMappedSeats] = useState<Seat[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Lưu thông tin phim & suất chiếu vào store
  useEffect(() => {
    if (movie) {
      setBookingInfo({
        movie,
        showtimeId,
        cinema: cinema.name,
        auditorium: auditorium.name,
        showtime: `${time} - ${formatDate(date)}`,
        format,
      });
    }
  }, [movie]);

  useEffect(() => {
    if (!seatDtos.length) return;
    const seatsMapped = seatDtos.map((d) => ({
      id: d.id,
      row: d.code?.charAt(0) || "A",
      number: Number(d.code?.slice(1)) || d.colIndex,
      type: mapSeatType(d.type),
      status: mapSeatStatus(d.status, d.reservationStatus),
      reservationStatus: mapReservationStatus(d.reservationStatus),
      price: d.price,
      priceId: d.priceId,
    }));
    setMappedSeats(seatsMapped);
  }, [seatDtos]);

  const toggleSeat = async (seat: Seat) => {
    if (seat.status === "booked") return;
    const selected = seats.some((s) => s.id === seat.id);

    if (selected) removeSeat(seat.id);
    else if (seats.length >= 8) Alert.alert("Giới hạn", "Bạn chỉ được chọn tối đa 8 ghế.");
    else addSeat(seat);
  };

  const handleContinue = async () => {
    if (!seats.length) {
      Alert.alert("Chọn ghế", "Vui lòng chọn ít nhất 1 ghế.");
      return;
    }

    try {
      const seatStatusResults = await Promise.all(
        seats.map((seat) => checkSeatStatus(seat.id, showtimeId))
      );
      const heldSeats = seatStatusResults.filter((r) => r.status === "HELD");
      const bookedSeats = seatStatusResults.filter((r) => r.status === "BOOKED");
      if (heldSeats.length > 0 || bookedSeats.length > 0) {
        const heldIds = heldSeats.map((h) => h.seatId);
        const bookedIds = bookedSeats.map((h) => h.seatId);
        heldIds.forEach((id) => removeSeat(id));
        bookedIds.forEach((id) => removeSeat(id));
        await refetchSeats();
        Alert.alert(
          "Ghế đang được giữ",
          "Một số ghế đã bị giữ hoặc đã được đặt. Vui lòng chọn lại."
        );
        return;
      }

      await Promise.allSettled(seats.map((seat) => bookSeat({ seatId: seat.id, showtimeId })));

      setExpireTime(8 * 60);
      navigation.navigate("AdditionalService");
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể giữ ghế, vui lòng thử lại.");
    }
  };

  if (isSeatsLoading || isLoading)
    return (
      <PickView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </PickView>
    );

  return (
    <ImageBackground
      source={movie?.poster ? { uri: movie.poster } : undefined}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <PickView style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)" }}>
        <ScreenHeader title="Chọn ghế" />

        <ScrollView
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setContainerSize({ width, height });
          }}
        >
          <SeatMapZoomable watchDeps={[mappedSeats, seats]} containerSize={containerSize}>
            <PickView style={{ alignItems: "center", justifyContent: "center" }}>
              <View style={styles.screenWrapper}>
                <Svg height="40" width="300">
                  <Path
                    d="M 0 20 Q 150 0 300 20"
                    stroke="#ff0080"
                    strokeWidth="8"
                    fill="transparent"
                  />
                </Svg>
                <PickText style={styles.screenLabel}>MÀN HÌNH</PickText>
              </View>
              <SeatMap seats={mappedSeats} selectedSeats={seats} onSelectSeat={toggleSeat} />
              <SeatLegend />
            </PickView>
          </SeatMapZoomable>
        </ScrollView>

        <BookingSummary onContinue={handleContinue} />
      </PickView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, justifyContent: "space-between" },
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

  screenWrapper: {
    width: 350,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 50,
  },

  screenLabel: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    letterSpacing: 2,
    marginTop: -4,
  },
});

export default SelectSeatScreen;
