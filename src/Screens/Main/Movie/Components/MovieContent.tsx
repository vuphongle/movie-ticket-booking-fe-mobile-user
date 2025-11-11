import React from "react";
import { ScrollView, Image, TouchableOpacity, Linking } from "react-native";
import { PickView, PickText } from "@Components";
import useThemedStyles from "@Theme/Hook/useThemedStyles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export interface Person {
  id: number;
  name: string;
}
export interface Genre {
  id: number;
  name: string;
}

export interface MovieContentProps {
  movie: {
    id: number;
    name: string;
    nameEn: string;
    poster: string;
    duration: number;
    rating: number;
    genres: Genre[];
    showDate: string | Date;
    directors: Person[];
    actors: Person[];
    trailer?: string;
    country: { id: number; name: string; slug: string };
    description?: string;
  };
}

const MovieDetailScreen: React.FC<MovieContentProps> = ({ movie }) => {
  const { colors, spacing } = useThemedStyles();

  const openTrailer = () => {
    if (movie.trailer) {
      const url = movie.trailer.startsWith("http")
        ? movie.trailer
        : `https://www.youtube.com/watch?v=${movie.trailer}`;
      Linking.openURL(url);
    }
  };

  const infoBoxes = [
    { label: "⏱", value: `${movie.duration} phút` },
    { label: "⭐", value: `${movie.rating}` },
    { label: "🎞", value: movie.genres.map((g) => g.name).join(", ") },
  ];

  return (
    <PickView flex={1} backgroundColor={colors.background["bg-primary"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <PickView>
          <Image
            source={{ uri: movie.poster }}
            style={{ width: "100%", height: 180, resizeMode: "cover" }}
          />
          {movie.trailer && (
            <TouchableOpacity
              onPress={openTrailer}
              activeOpacity={0.8}
              style={{
                position: "absolute",
                top: "30%",
                left: "42%",
                backgroundColor: "rgba(0,0,0,0.6)",
                borderRadius: 50,
                width: 80,
                height: 80,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: colors.background["bg-brand-quaternary"],
              }}
            >
              <MaterialCommunityIcons
                name="play"
                size={48}
                color={colors.background["bg-brand-quaternary"]}
              />
            </TouchableOpacity>
          )}
        </PickView>

        <PickView padding={spacing.s16}>
          <PickView marginBottom={6}>
            <PickText size={22} font="bold" style={{ color: colors.text["heading-primary"] }}>
              {movie.name}
            </PickText>
            <PickText
              size={15}
              style={{ color: colors.text.body, fontStyle: "italic", marginBottom: 12 }}
            >
              {movie.nameEn}
            </PickText>

            <PickView row gap={6} flexWrap="wrap">
              {infoBoxes.map((box, i) => (
                <PickView
                  key={i}
                  style={{
                    borderWidth: 1,
                    borderColor: "#000",
                    borderRadius: 6,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    marginBottom: 6,
                  }}
                >
                  <PickText size={13}>
                    {box.label}: {box.value}
                  </PickText>
                </PickView>
              ))}
            </PickView>
          </PickView>

          <PickView
            style={{
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: "#000",
              paddingVertical: 8,
            }}
          >
            <PickText size={13} style={{ marginBottom: 2 }}>
              Đạo diễn: {movie.directors.map((d) => d.name).join(", ")}
            </PickText>
            <PickText size={13} style={{ marginBottom: 2 }}>
              Diễn viên: {movie.actors.map((a) => a.name).join(", ")}
            </PickText>
            <PickView style={{ marginBottom: 2 }}>
              <PickText size={13} numberOfLines={2} ellipsizeMode="tail" lineHeight={20}>
                Mô tả: {movie.description}
              </PickText>
            </PickView>
          </PickView>
        </PickView>
      </ScrollView>
    </PickView>
  );
};

export default MovieDetailScreen;
