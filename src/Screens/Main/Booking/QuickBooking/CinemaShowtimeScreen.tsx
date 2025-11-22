import React, { useMemo, useState } from "react";
import { ScrollView, View, TouchableOpacity, Image } from "react-native";
import { PickView, PickText, ScreenHeader } from "@Components";
import { SPACING, FONT_SIZE, RADIUS, COLORS } from "@Constants/theme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { parseGraphicArray } from "@Utils/graphicUtils";

import { useMoviesShowtimesByCinemaName } from "@Hooks/showtime/useMoviesShowtimesByCinema";
import { useAuth } from "@Contexts/AuthContext";
import { RootStackParamList } from "@Types/navigationTypes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import UniversalConfirmModal from "@Components/Modals/UniversalConfirmModal";

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const pad = (n: number) => n.toString().padStart(2, "0");

const CinemaShowtimeScreen = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute();
  const { cinemaId, cinemaName } = route.params as any;
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { state } = useAuth();
  const { isAuthenticated } = state;

  const { movies = [] } = useMoviesShowtimesByCinemaName(cinemaName);

  const today = useMemo(() => new Date(), []);
  const next10Days = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => {
        const d = new Date();
        d.setDate(today.getDate() + i);
        return d;
      }),
    []
  );

  const [selectedDate, setSelectedDate] = useState(next10Days[0]);

  const weekdays = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

  return (
    <PickView flex={1}>
      <ScreenHeader title={cinemaName} />
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* --- Ngày chiếu --- */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            padding: SPACING.md,
            gap: SPACING.sm,
          }}
        >
          {next10Days.map((d) => {
            const isActive = selectedDate.toDateString() === d.toDateString();

            const label =
              d.toDateString() === today.toDateString() ? "Hôm nay" : `${weekdays[d.getDay()]}`;

            return (
              <TouchableOpacity key={d.toDateString()} onPress={() => setSelectedDate(d)}>
                <PickView
                  style={{
                    paddingVertical: SPACING.sm,
                    paddingHorizontal: SPACING.lg,
                    borderRadius: RADIUS.md,
                    backgroundColor: isActive ? "#ffe53e" : "#411465",
                  }}
                >
                  <PickText
                    style={{
                      color: isActive ? "black" : "white",
                      fontWeight: isActive ? "bold" : "600",
                      textAlign: "center",
                    }}
                  >
                    {label + "\n" + `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`}
                  </PickText>
                </PickView>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {movies.every((movie: any) => {
          const showtimes = movie.showtimes.filter((st: any) => {
            const [y, m, d] = st.date;
            const dt = new Date(y, m - 1, d);
            return dt.toDateString() === selectedDate.toDateString();
          });
          return showtimes.length === 0;
        }) && (
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
              marginHorizontal: SPACING.md,
            }}
          >
            <Icon name="movie-open-outline" size={55} color={COLORS.text.secondary} />
            <PickText
              style={{
                marginTop: SPACING.sm,
                fontSize: FONT_SIZE.md,
                color: COLORS.text.secondary,
              }}
            >
              Hiện chưa có suất chiếu nào trong ngày
            </PickText>
          </PickView>
        )}

        {/* --- Movie list --- */}
        {movies.map((movie: any) => {
          const showtimes = movie.showtimes.filter((st: any) => {
            const [y, m, d] = st.date;
            const dt = new Date(y, m - 1, d);
            const isSameDate = dt.toDateString() === selectedDate.toDateString();

            if (!isSameDate) return false;

            const now = new Date();
            if (selectedDate.toDateString() === now.toDateString()) {
              const [hour, minute] = st.startTime.split(":").map(Number);
              const showtimeDate = new Date(y, m - 1, d, hour, minute);

              if (showtimeDate <= now) return false;
            }

            return true;
          });

          if (showtimes.length === 0) return null;

          return (
            <PickView
              key={movie.id}
              style={{
                marginHorizontal: SPACING.md,
                marginBottom: SPACING.lg,
                paddingBottom: SPACING.md,
                borderBottomWidth: 5,
                borderColor: COLORS.border,
              }}
            >
              <View style={{ flexDirection: "row", gap: SPACING.md }}>
                <Image
                  source={{ uri: movie.poster }}
                  style={{
                    width: 110,
                    height: 160,
                    borderRadius: RADIUS.md,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <PickText
                    style={{
                      fontSize: FONT_SIZE.lg,
                      fontWeight: "700",
                      marginBottom: 16,
                    }}
                  >
                    {movie.name}
                  </PickText>

                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: SPACING.xs }}>
                    {parseGraphicArray(movie.graphics).map((g) => (
                      <PickView
                        key={g}
                        style={{
                          borderWidth: 1,
                          borderColor: COLORS.text.secondary,
                          paddingHorizontal: SPACING.sm,
                          paddingVertical: 2,
                          borderRadius: RADIUS.sm,
                        }}
                      >
                        <PickText>{g.replace(/_/g, "").toUpperCase()}</PickText>
                      </PickView>
                    ))}

                    {movie.age && (
                      <PickView
                        style={{
                          backgroundColor: "#d4a017",
                          paddingHorizontal: SPACING.sm,
                          paddingVertical: 2,
                          borderRadius: RADIUS.sm,
                        }}
                      >
                        <PickText style={{ color: "white" }}>{movie.age}</PickText>
                      </PickView>
                    )}
                  </View>
                </View>
              </View>

              {/* Suất chiếu */}
              <View style={{ marginTop: SPACING.md }}>
                {(
                  Object.entries(
                    showtimes.reduce((acc: Record<string, any[]>, st: any) => {
                      const graphicsMap = { _2D: "2D", _3D: "3D" } as const;
                      const translationMap = {
                        SUBTITLING: "Phụ đề",
                        DUBBING: "Lồng tiếng",
                      } as const;

                      const graphics =
                        graphicsMap[st.graphicsType as keyof typeof graphicsMap] ?? st.graphicsType;

                      const translation =
                        translationMap[st.translationType as keyof typeof translationMap] ??
                        st.translationType;

                      const key = `Phòng ${st.auditoriumType} - ${graphics} ${translation}`;

                      if (!acc[key]) acc[key] = [];
                      acc[key].push(st);

                      return acc;
                    }, {})
                  ) as [string, any[]][]
                ).map(([groupName, sts]) => (
                  <View key={groupName} style={{ marginBottom: SPACING.md }}>
                    {/* Group Title */}
                    <PickText
                      style={{
                        fontSize: 17,
                        fontWeight: "600",
                        color: COLORS.text.primary,
                      }}
                    >
                      {groupName}
                    </PickText>

                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: SPACING.md,
                        marginTop: SPACING.sm,
                      }}
                    >
                      {sts.map((st) => (
                        <TouchableOpacity
                          key={st.id}
                          onPress={() => {
                            if (!isAuthenticated) {
                              setShowLoginModal(true);
                              return;
                            }

                            const auditorium = {
                              id: st.auditoriumId,
                              name: st.auditoriumName,
                              type: st.auditoriumType,
                              totalSeats: st.totalSeats,
                              totalRows: st.totalRows,
                              totalColumns: st.totalColumns,
                            };

                            const cinema = {
                              id: st.cinemaId,
                              name: st.cinemaName,
                              location: st.location,
                            };

                            const graphicsMap = { _2D: "2D", _3D: "3D" } as const;
                            const translationMap = {
                              SUBTITLING: "Phụ đề",
                              DUBBING: "Lồng tiếng",
                            } as const;

                            const payload = {
                              showtimeId: st.id,
                              slug: movie.slug,
                              time: st.startTime,
                              date: st.date,
                              auditorium,
                              cinema,
                              format: `${
                                graphicsMap[st.graphicsType as keyof typeof graphicsMap] ??
                                st.graphicsType
                              } - ${
                                translationMap[st.translationType as keyof typeof translationMap] ??
                                st.translationType
                              }`,
                            };

                            navigation.navigate("SelectSeat", payload);
                          }}
                        >
                          <PickView
                            style={{
                              paddingVertical: 8,
                              paddingHorizontal: 18,
                              backgroundColor: "#263864",
                              borderRadius: RADIUS.md,
                            }}
                          >
                            <PickText style={{ color: "white", fontWeight: "bold" }}>
                              {st.startTime}
                            </PickText>
                          </PickView>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            </PickView>
          );
        })}
      </ScrollView>
      <UniversalConfirmModal
        visible={showLoginModal}
        title="Yêu cầu đăng nhập"
        message="Vui lòng đăng nhập để đặt ghế."
        buttons={[
          {
            text: "Hủy",
            type: "cancel",
            onPress: () => setShowLoginModal(false),
          },
          {
            text: "Đăng nhập",
            type: "primary",
            onPress: () => {
              setShowLoginModal(false);
              navigation.navigate("Login", {
                redirectTo: "CinemaShowtime",
                params: { cinemaId, cinemaName },
              });
            },
          },
        ]}
      />
    </PickView>
  );
};

export default CinemaShowtimeScreen;
