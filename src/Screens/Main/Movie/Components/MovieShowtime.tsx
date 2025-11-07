import React, { useMemo, useState } from "react";
import { ScrollView, View, Alert } from "react-native";
import { PickText, PickView, ScreenHeader } from "@Components";
import { COLORS, SPACING, FONT_SIZE, RADIUS } from "@Constants/theme";
import { useShowtimeByMovie } from "@Hooks";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "@Contexts/AuthContext";
import useThemedStyles from "@Theme/Hook/useThemedStyles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import DateButton from "./DateButton";
import ShowtimeButton from "./ShowtimeButton";
import CinemaHeader from "./CinemaHeader";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@Types/navigationTypes";

type SelectScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "SelectSeat">;

const pad = (n: number) => n.toString().padStart(2, "0");

const MovieShowtime: React.FC = () => {
  const route = useRoute();
  const { state } = useAuth();
  const { isAuthenticated } = state;
  const navigation = useNavigation<SelectScreenNavigationProp>();
  const { colors, spacing } = useThemedStyles();
  const { movieId, movieName, slug } = route.params as {
    movieId: number;
    movieName: string;
    slug: string;
  };

  const today = useMemo(() => new Date(), []);
  const next7Days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(today.getDate() + i);
        return d;
      }),
    [today]
  );

  const [selectedDate, setSelectedDate] = useState(next7Days[0]);
  const [expandedCinemas, setExpandedCinemas] = useState<number[]>([]);
  const showDateStr = useMemo(
    () =>
      `${selectedDate.getFullYear()}-${pad(selectedDate.getMonth() + 1)}-${pad(
        selectedDate.getDate()
      )}`,
    [selectedDate]
  );
  const { showtimes = [], isLoading } = useShowtimeByMovie({
    movieId,
    showDate: showDateStr,
    enabled: !!movieId,
  });

  const groupedShowtimes = useMemo(() => {
    const map = new Map<number, any>();
    showtimes.forEach((st: any) => {
      if (!map.has(st.cinema.id)) map.set(st.cinema.id, { cinema: st.cinema, roomTypes: [] });
      const cinemaGroup = map.get(st.cinema.id);
      let roomGroup = cinemaGroup.roomTypes.find((r: any) => r.type === st.auditorium.type);
      if (!roomGroup) {
        roomGroup = { type: st.auditorium.type, formats: [] };
        cinemaGroup.roomTypes.push(roomGroup);
      }
      let formatGroup = roomGroup.formats.find((f: any) => f.format === st.format);
      if (!formatGroup) {
        formatGroup = { format: st.format, times: [] };
        roomGroup.formats.push(formatGroup);
      }
      formatGroup.times.push({
        id: st.id,
        cinema: st.cinema,
        auditorium: st.auditorium,
        time: st.startTime,
        date: st.date,
        format: st.format,
      });
      formatGroup.times.sort((a: any, b: any) => {
        const [ha, ma] = a.time.split(":").map(Number);
        const [hb, mb] = b.time.split(":").map(Number);
        return ha * 60 + ma - (hb * 60 + mb);
      });
    });
    return Array.from(map.values());
  }, [showtimes]);

  React.useEffect(() => {
    if (groupedShowtimes.length > 0) setExpandedCinemas([groupedShowtimes[0].cinema.id]);
  }, [groupedShowtimes]);

  const toggleCinema = (cinemaId: number) =>
    setExpandedCinemas((prev) =>
      prev.includes(cinemaId) ? prev.filter((id) => id !== cinemaId) : [...prev, cinemaId]
    );
  const handleTimeClick = (
    showtimeId: number,
    cinema: number,
    auditorium: number,
    time: string,
    date: string,
    format: string
  ) => {
    if (!isAuthenticated) {
      Alert.alert("Yêu cầu đăng nhập", "Vui lòng đăng nhập để đặt ghế.", [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đăng nhập",
          onPress: () =>
            navigation.navigate("Login", {
              redirectTo: "MovieShowtime",
              params: { movieId, movieName, slug },
            }),
        },
      ]);
      return;
    }
    console.log("🎬 Selected Showtime:", {
      showtimeId,
      cinema,
      auditorium,
      time,
      date,
      format,
      slug,
    });
    navigation.navigate("SelectSeat", {
      showtimeId,
      cinema,
      auditorium,
      time,
      date,
      format,
      slug,
    });
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
      <ScreenHeader title={movieName} backgroundColor={colors.background["bg-brand-quaternary"]} />

      <PickText
        style={{
          fontSize: FONT_SIZE.lg,
          fontWeight: "600",
          color: COLORS.text.primary,
          marginLeft: spacing.s16,
          marginTop: spacing.s16,
        }}
      >
        Chọn ngày chiếu
      </PickText>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingTop: SPACING.xs }}
      >
        {next7Days.map((d) => (
          <DateButton
            key={d.toDateString()}
            date={d}
            isActive={d.getDate() === selectedDate.getDate()}
            onPress={setSelectedDate}
          />
        ))}
      </ScrollView>

      {isLoading ? (
        <PickView
          style={{
            alignItems: "center",
            justifyContent: "center",
            minHeight: 300,
            marginTop: SPACING.md,
          }}
        >
          <PickText>Đang tải lịch chiếu...</PickText>
        </PickView>
      ) : groupedShowtimes.length === 0 ? (
        <PickView
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: 300,
            marginTop: SPACING.md,
            borderRadius: RADIUS.md,
            borderWidth: 1,
            borderColor: COLORS.border,
            backgroundColor: COLORS.surface,
          }}
        >
          <Icon name="movie-open-outline" size={55} color={COLORS.text.secondary} />
          <PickText
            style={{ marginTop: SPACING.sm, fontSize: FONT_SIZE.md, color: COLORS.text.secondary }}
          >
            Hiện chưa có suất chiếu nào trong ngày
          </PickText>
        </PickView>
      ) : (
        groupedShowtimes.map((group) => {
          const isExpanded = expandedCinemas.includes(group.cinema.id);
          return (
            <PickView
              key={group.cinema.id}
              style={{
                marginTop: SPACING.sm,
                backgroundColor: "#F8FAFB",
                borderRadius: RADIUS.md,
                padding: SPACING.md,
                width: "100%",
              }}
            >
              <CinemaHeader
                name={group.cinema.name}
                isExpanded={isExpanded}
                onPress={() => toggleCinema(group.cinema.id)}
              />
              {isExpanded &&
                group.roomTypes.map((room: any) => (
                  <View key={room.type} style={{ marginLeft: 10, marginTop: SPACING.sm }}>
                    {room.formats.map((f: any) => (
                      <View key={f.format}>
                        <PickText
                          style={{
                            fontSize: FONT_SIZE.md,
                            color: COLORS.text.secondary,
                            marginBottom: 2,
                          }}
                        >{`Phòng ${room.type} | ${f.format}`}</PickText>
                        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm }}>
                          {f.times.map((t: any) => (
                            <ShowtimeButton
                              key={t.id}
                              time={t.time}
                              onPress={() =>
                                handleTimeClick(
                                  t.id,
                                  t.cinema,
                                  t.auditorium,
                                  t.time,
                                  t.date,
                                  t.format
                                )
                              }
                            />
                          ))}
                        </View>
                      </View>
                    ))}
                  </View>
                ))}
            </PickView>
          );
        })
      )}
    </ScrollView>
  );
};

export default MovieShowtime;
