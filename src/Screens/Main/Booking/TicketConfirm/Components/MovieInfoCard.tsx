import React from "react";
import { View, Image } from "react-native";
import { PickView, PickText } from "@Components";
import { FONT_SIZE, SPACING } from "@Constants/theme";
import { useTranslation } from "@Hooks/useTranslation";
import { getMovieTitle } from "@Utils";

interface MovieInfoCardProps {
  movie?: {
    name: string;
    nameEn?: string | null;
    poster: string;
    age: string;
    duration: number;
  };
  cinema?: string;
  auditorium?: string;
  showtime?: string;
  format?: string;
}

const MovieInfoCard: React.FC<MovieInfoCardProps> = ({
  movie,
  cinema,
  auditorium,
  showtime,
  format,
}) => {
  const { t, language } = useTranslation();
  if (!movie) return null;
  const displayMovieName = getMovieTitle(movie, language);

  return (
    <PickView
      style={{
        backgroundColor: "#FFF",
        padding: SPACING.md,
        shadowColor: "#00000020",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <View style={{ flexDirection: "row", gap: SPACING.md }}>
        <Image
          source={{ uri: movie.poster }}
          style={{ width: 80, height: 120, borderRadius: 12 }}
          resizeMode="cover"
        />
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <PickText
              style={{
                fontSize: FONT_SIZE.xl,
                fontWeight: "700",
                color: "#012e6e",
                flexShrink: 1,
              }}
            >
              {displayMovieName}
            </PickText>
            <View style={{ alignItems: "flex-end" }}>
              <PickText
                style={{
                  fontSize: FONT_SIZE.sm,
                  fontWeight: "bold",
                  color: "#FFF",
                  backgroundColor: "#FF6B35",
                  borderRadius: 4,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                }}
              >
                {movie.age}
              </PickText>
            </View>
          </View>

          <PickText style={{ color: "#4B4B4B", fontSize: FONT_SIZE.sm }}>
            {t("BOOKING_MOVIE_DURATION", { minutes: movie.duration })}
          </PickText>
          <PickText style={{ color: "#4B4B4B", fontSize: FONT_SIZE.sm }}>
            {cinema} - {auditorium}
          </PickText>

          <View
            style={{ flexDirection: "row", alignItems: "center", gap: SPACING.sm, marginTop: 4 }}
          >
            <PickView
              style={{
                backgroundColor: "#E6EFF9",
                borderRadius: 8,
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}
            >
              <PickText style={{ fontSize: FONT_SIZE.sm, fontWeight: "700", color: "#012e6e" }}>
                {showtime}
              </PickText>
            </PickView>
            <PickView
              style={{
                backgroundColor: "#FFEDE3",
                borderRadius: 8,
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}
            >
              <PickText style={{ fontSize: FONT_SIZE.sm, fontWeight: "700", color: "#012e6e" }}>
                {format}
              </PickText>
            </PickView>
          </View>
        </View>
      </View>
    </PickView>
  );
};

export default MovieInfoCard;
