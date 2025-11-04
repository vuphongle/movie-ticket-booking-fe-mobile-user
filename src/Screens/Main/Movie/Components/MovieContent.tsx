import React from "react";
import { ScrollView, Image, TouchableOpacity, Linking } from "react-native";
import { PickView, PickText } from "@Components";
import useThemedStyles from "@Theme/Hook/useThemedStyles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export interface Person {
  id: number;
  name: string;
  avatar: string;
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
  };
}

const MovieDetailScreen: React.FC<MovieContentProps> = ({ movie }) => {
  const { colors, spacing, radius } = useThemedStyles();

  const openTrailer = () => {
    if (movie.trailer) {
      const youtubeUrl = movie.trailer.startsWith("http")
        ? movie.trailer
        : `https://www.youtube.com/watch?v=${movie.trailer}`;
      Linking.openURL(youtubeUrl);
    }
  };

  return (
    <PickView flex={1} backgroundColor={colors.background["bg-primary"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Poster */}
        <PickView>
          <Image
            source={{ uri: movie.poster }}
            style={{
              width: "100%",
              height: 400,
              resizeMode: "cover",
            }}
          />

          {movie.trailer && (
            <TouchableOpacity
              onPress={openTrailer}
              activeOpacity={0.8}
              style={{
                position: "absolute",
                top: "40%",
                left: "42%",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
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

        {/* Movie Info */}
        <PickView padding={spacing.s16}>
          <PickText
            size={22}
            font="bold"
            style={{
              color: colors.text["heading-primary"],
              marginBottom: spacing.s8,
            }}
          >
            {movie.name}
          </PickText>

          <PickText
            size={16}
            style={{
              color: colors.text.body,
              fontStyle: "italic",
              marginBottom: spacing.s8,
            }}
          >
            {movie.nameEn}
          </PickText>

          {/* Quốc gia */}
          {movie.country && (
            <PickView row alignCenter gap={spacing.s8} marginBottom={spacing.s16}>
              <MaterialCommunityIcons
                name="earth"
                size={18}
                color={colors.background["bg-brand-quaternary"]}
              />
              <PickText size={14} style={{ color: colors.text.body }}>
                Nước sản xuất: {movie.country.name}
              </PickText>
            </PickView>
          )}

          {/* Meta Info */}
          <PickView
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: spacing.s16,
              marginBottom: spacing.s16,
            }}
          >
            <PickView row alignCenter gap={spacing.s8}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={18}
                color={colors.background["bg-brand-quaternary"]}
              />
              <PickText size={14} style={{ color: colors.text.body }}>
                {movie.duration} phút
              </PickText>
            </PickView>

            <PickView row alignCenter gap={spacing.s8}>
              <MaterialCommunityIcons
                name="star"
                size={18}
                color={colors.background["bg-brand-quaternary"]}
              />
              <PickText size={14} style={{ color: colors.text.body }}>
                {movie.rating}
              </PickText>
            </PickView>

            <PickView row alignCenter gap={spacing.s8}>
              <MaterialCommunityIcons
                name="filmstrip"
                size={18}
                color={colors.background["bg-brand-quaternary"]}
              />
              <PickText size={14} style={{ color: colors.text.body }}>
                {movie.genres.map((g) => g.name).join(", ")}
              </PickText>
            </PickView>

            <PickView row alignCenter gap={spacing.s8}>
              <MaterialCommunityIcons
                name="calendar"
                size={18}
                color={colors.background["bg-brand-quaternary"]}
              />
              <PickText size={14} style={{ color: colors.text.body }}>
                {new Date(movie.showDate).toLocaleDateString()}
              </PickText>
            </PickView>
          </PickView>
          <PickView
            row
            gap={spacing.s16}
            marginTop={spacing.s16}
            marginBottom={spacing.s32}
            style={{
              backgroundColor: "#F9F9FB",
              padding: spacing.s8,
              borderRadius: radius.r12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <PickView flex={1}>
              <PickText
                size={18}
                font="semibold"
                style={{
                  color: colors.text["heading-primary"],
                  marginBottom: spacing.s8,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border["border-primary"],
                  paddingBottom: spacing.s4,
                }}
              >
                🎬 Đạo diễn
              </PickText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {movie.directors.map((d) => (
                  <PickView key={d.id} alignCenter marginRight={spacing.s8} width={70}>
                    <Image
                      source={{ uri: d.avatar }}
                      style={{
                        width: 64,
                        height: 96,
                        borderRadius: radius.r8,
                        marginBottom: spacing.s4,
                      }}
                    />
                    <PickText
                      size={11}
                      numberOfLines={1}
                      style={{
                        color: colors.text.body,
                        textAlign: "center",
                      }}
                    >
                      {d.name}
                    </PickText>
                  </PickView>
                ))}
              </ScrollView>
            </PickView>

            <PickView flex={2}>
              <PickText
                size={18}
                font="semibold"
                style={{
                  color: colors.text["heading-primary"],
                  marginBottom: spacing.s8,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border["border-primary"],
                  paddingBottom: spacing.s4,
                }}
              >
                🎭 Diễn viên
              </PickText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {movie.actors.map((a) => (
                  <PickView key={a.id} alignCenter marginRight={spacing.s8} width={70}>
                    <Image
                      source={{ uri: a.avatar }}
                      style={{
                        width: 64,
                        height: 96,
                        borderRadius: radius.r8,
                        marginBottom: spacing.s4,
                      }}
                    />
                    <PickText
                      size={11}
                      numberOfLines={1}
                      style={{
                        color: colors.text.body,
                        textAlign: "center",
                      }}
                    >
                      {a.name}
                    </PickText>
                  </PickView>
                ))}
              </ScrollView>
            </PickView>
          </PickView>
        </PickView>
      </ScrollView>
    </PickView>
  );
};

export default MovieDetailScreen;
