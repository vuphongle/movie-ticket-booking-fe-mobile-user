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
import UniversalConfirmModal from "@Components/Modals/UniversalConfirmModal";
import { useTranslation } from "@Hooks/useTranslation";

type NavProp = NativeStackNavigationProp<RootStackParamList, "AdditionalService">;

const SelectSeatScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<NavProp>();
  const insets = useSafeAreaInsets();
  const { showtimeId, cinema, auditorium, time, date, format } = route.params;
  const auditoriumId = auditorium.id;
  const { movie, isLoading } = useMovieByShowtime(showtimeId);
  const [isPending, setIsPending] = useState(false);

  const {
    seats: seatDtos,
    isLoading: isSeatsLoading,
    refetch: refetchSeats,
  } = useSeats({ auditoriumId, showtimeId });
  const { addSeat, removeSeat, setBookingInfo, seats, setExpireTime, clearAll } = useBookingStore();
  const checkSeatStatus = useLazyCheckSeatStatus();
  const { mutateAsync: bookSeat } = useBookSeat();
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [ageTitle, setAgeTitle] = useState("");
  const [ageMessage, setAgeMessage] = useState("");
  const [isAgeConfirmed, setIsAgeConfirmed] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showNoSeatModal, setShowNoSeatModal] = useState(false);
  const [showHeldSeatModal, setShowHeldSeatModal] = useState(false);
  const { t } = useTranslation();

  const [mappedSeats, setMappedSeats] = useState<Seat[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    clearAll();
  }, [showtimeId]);

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
    else if (seats.length >= 8) setShowLimitModal(true);
    else addSeat(seat);
  };

  const handleContinue = async () => {
    if (!seats.length) {
      setShowNoSeatModal(true);
      return;
    }
    if (movie?.age && movie.age !== "P" && !isAgeConfirmed) {
      let ageNumber = movie.age.replace("T", "");
      if (movie.age === "K") ageNumber = "0";

      setAgeTitle(t("BOOKING_SELECT_SEAT_AGE_TITLE", { age: movie.age }));
      setAgeMessage(
        t("BOOKING_SELECT_SEAT_AGE_MESSAGE", {
          age: ageNumber,
        })
      );
      setShowAgeModal(true);
      return;
    }

    if (isPending) return;
    setIsPending(true);

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
        setShowHeldSeatModal(true);
        return;
      }

      await Promise.allSettled(seats.map((seat) => bookSeat({ seatId: seat.id, showtimeId })));

      setExpireTime(8 * 60);
      navigation.navigate("AdditionalService");
    } catch (err) {
      console.error(err);
      Alert.alert(t("COMMON_ERROR"), t("BOOKING_SELECT_SEAT_RESERVE_ERROR"));
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    if (isAgeConfirmed) {
      handleContinue();
    }
  }, [isAgeConfirmed]);

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
        <ScreenHeader title={t("BOOKING_SELECT_SEAT_TITLE")} />

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
                <PickText style={styles.screenLabel}>{t("BOOKING_SELECT_SEAT_SCREEN_LABEL")}</PickText>
              </View>
              <SeatMap seats={mappedSeats} selectedSeats={seats} onSelectSeat={toggleSeat} />
              <SeatLegend />
            </PickView>
          </SeatMapZoomable>
        </ScrollView>

        <BookingSummary onContinue={handleContinue} isPending={isPending} />
      </PickView>
      <UniversalConfirmModal
        visible={showAgeModal}
        title={ageTitle}
        message={ageMessage}
        buttons={[
          {
            text: t("COMMON_CANCEL"),
            type: "cancel",
            onPress: () => setShowAgeModal(false),
          },
          {
            text: t("COMMON_AGREE"),
            type: "primary",
            onPress: () => {
              setShowAgeModal(false);
              setIsAgeConfirmed(true);
            },
          },
        ]}
      />

      {/* Modal giới hạn 8 ghế */}
      <UniversalConfirmModal
        visible={showLimitModal}
        title={t("BOOKING_SELECT_SEAT_LIMIT_TITLE")}
        message={t("BOOKING_SELECT_SEAT_LIMIT_MESSAGE")}
        buttons={[
          {
            text: t("COMMON_OK"),
            type: "primary",
            onPress: () => setShowLimitModal(false),
          },
        ]}
      />

      {/* Modal chưa chọn ghế */}
      <UniversalConfirmModal
        visible={showNoSeatModal}
        title={t("BOOKING_SELECT_SEAT_NO_SELECTION_TITLE")}
        message={t("BOOKING_SELECT_SEAT_NO_SELECTION_MESSAGE")}
        buttons={[
          { text: t("COMMON_OK"), type: "primary", onPress: () => setShowNoSeatModal(false) },
        ]}
      />

      {/* Modal ghế đang được giữ */}
      <UniversalConfirmModal
        visible={showHeldSeatModal}
        title={t("BOOKING_SELECT_SEAT_HELD_TITLE")}
        message={t("BOOKING_SELECT_SEAT_HELD_MESSAGE")}
        buttons={[
          { text: t("COMMON_OK"), type: "primary", onPress: () => setShowHeldSeatModal(false) },
        ]}
      />
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
