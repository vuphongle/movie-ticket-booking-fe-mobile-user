import React, { useMemo } from "react";
import { ScrollView, TouchableOpacity, ActivityIndicator, Linking } from "react-native";
import { PickView, PickText } from "@Components";
import { SPACING, FONT_SIZE, RADIUS, COLORS } from "@Constants/theme";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@Types/navigationTypes";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import useThemedStyles from "@Theme/Hook/useThemedStyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAllCinemas } from "@Hooks/cinema/useAllCinemas";
import { parseLatLng } from "@Utils/parseLatLng";
import { useCinemaDistances } from "@Hooks/cinema/useCinemaDistances";
import StaticMap from "@Components/Map/StaticMap";

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const QuicklyBookingScreen = () => {
  const navigation = useNavigation<NavProp>();
  const { colors, spacing } = useThemedStyles();
  const insets = useSafeAreaInsets();
  const { data: cinemas = [], isLoading } = useAllCinemas();

  const distances = useCinemaDistances(cinemas);

  const sortedCinemas = useMemo(() => {
    if (!cinemas || cinemas.length === 0) return [];

    return [...cinemas].sort((a, b) => {
      const da = distances[a.id];
      const db = distances[b.id];

      const daValid = typeof da === "number";
      const dbValid = typeof db === "number";

      if (daValid && dbValid) return da - db;
      if (daValid && !dbValid) return -1;
      if (!daValid && dbValid) return 1;
      return 0;
    });
  }, [cinemas, distances]);

  if (isLoading) {
    return (
      <PickView alignCenter justifyCenter style={{ paddingVertical: spacing.s48 * 2 }}>
        <ActivityIndicator size="large" color={colors.background["bg-brand-quaternary"]} />
        <PickText size={16} style={{ marginTop: spacing.s16, color: colors.text.body }}>
          Đang tải danh sách rạp
        </PickText>
      </PickView>
    );
  }

  return (
    <PickView
      flex={1}
      backgroundColor={colors.background["bg-primary"]}
      style={{ paddingBottom: insets.bottom + 50 }}
    >
      {/* HEADER */}
      <PickView
        backgroundColor={colors.background["bg-brand-quaternary"]}
        paddingHorizontal={spacing.s16}
        paddingTop={insets.top + spacing.s16}
        paddingBottom={spacing.s16}
        centerItems
        justifyCenter
        style={{
          borderBottomWidth: 1,
          borderBottomColor: colors.border["border-primary"],
        }}
      >
        <PickText size={24} font="bold" color="body-inverted" style={{ marginBottom: spacing.s4 }}>
          Mua vé nhanh
        </PickText>
        <PickText size={14} color="body-inverted">
          Chọn rạp - Chọn phim - Chọn ngày/suất chiếu
        </PickText>
      </PickView>

      {/* LIST */}
      <ScrollView
        contentContainerStyle={{ padding: SPACING.md, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {sortedCinemas.map((c) => {
          const { lat, lng } = parseLatLng(c.mapLocation);
          const distance = distances[c.id];

          const openMap = () => {
            const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
            Linking.openURL(url);
          };

          return (
            <TouchableOpacity
              key={c.id}
              onPress={() =>
                navigation.navigate("CinemaShowtime", {
                  cinemaId: c.id,
                  cinemaName: c.name,
                })
              }
              activeOpacity={0.9}
            >
              <PickView
                style={{
                  flexDirection: "row",
                  padding: SPACING.sm,
                  backgroundColor: COLORS.surface,
                  borderRadius: RADIUS.lg,
                  marginBottom: SPACING.md,

                  shadowColor: "#000",
                  shadowOpacity: 0.25,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 3 },

                  elevation: 6,
                }}
              >
                {/* MAP IMAGE + distance overlay */}
                <TouchableOpacity onPress={openMap} activeOpacity={0.8}>
                  <StaticMap
                    lat={lat}
                    lng={lng}
                    size={120}
                    zoom={15}
                    distanceKm={typeof distance === "number" ? distance : undefined}
                  />
                </TouchableOpacity>

                {/* INFO */}
                <PickView style={{ flex: 1, marginLeft: SPACING.md }}>
                  {/* NAME */}
                  <PickText
                    style={{
                      fontSize: FONT_SIZE.lg,
                      fontWeight: "700",
                      color: COLORS.text.primary,
                      marginTop: SPACING.xs,
                    }}
                  >
                    {c.name}
                  </PickText>

                  {/* ADDRESS */}
                  <PickText
                    style={{
                      fontSize: FONT_SIZE.md,
                      color: COLORS.text.secondary,
                      marginTop: 4,
                    }}
                  >
                    <Icon name="map-marker" size={14} /> {c.address}
                  </PickText>
                </PickView>
              </PickView>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </PickView>
  );
};

export default QuicklyBookingScreen;
