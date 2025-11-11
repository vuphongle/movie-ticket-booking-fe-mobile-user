import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useBookingStore } from "@Store/useBookingStore";
import { useNavigation } from "@react-navigation/native";
import { FONT_SIZE } from "@Constants/theme";
import { useCancelSeatMulti } from "@Hooks/booking/useReservation";

const BookingTimer: React.FC = () => {
  const navigation = useNavigation<any>();
  const { expireAt, showtimeId, seats, clearAll } = useBookingStore();
  const { mutateAsync: cancelSeatMulti } = useCancelSeatMulti();
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!expireAt) return;

    const updateTime = () => {
      const diff = Math.max(0, expireAt - Date.now());
      setTimeLeft(diff);
      if (diff <= 0) handleTimeout();
    };

    const timer = setInterval(updateTime, 1000);
    updateTime();

    return () => clearInterval(timer);
  }, [expireAt]);

  const handleTimeout = async () => {
    try {
      if (showtimeId && seats.length > 0) {
        await cancelSeatMulti({
          showtimeId,
          seatIds: seats.map((s) => s.id),
        });
      }
    } catch (err) {
      console.error("Cancel seat error:", err);
    } finally {
      clearAll();
      Alert.alert(
        "Hết thời gian giữ ghế",
        "Bạn đã hết thời gian 8 phút giữ ghế. Vui lòng Thực hiện lại thao tác.",
        [{ text: "OK", onPress: () => navigation.navigate("Main") }]
      );
    }
  };

  if (!expireAt || timeLeft <= 0) return null;

  const minutes = Math.floor(timeLeft / 1000 / 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Thời gian giữ ghế:
        <Text style={styles.time}>
          {" "}
          {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#012e6e",
    paddingVertical: 8,
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: FONT_SIZE.sm,
    textTransform: "none",
    fontWeight: "500",
  },
  time: {
    fontWeight: "bold",
    marginLeft: 4,
  },
});

export default BookingTimer;
