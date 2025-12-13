import React from "react";
import { ScrollView, Dimensions } from "react-native";
import { PickView, PickText } from "@Components";
import useThemedStyles from "@Theme/Hook/useThemedStyles";
import YoutubePlayer from "react-native-youtube-iframe";
import { useTranslation } from "@Hooks/useTranslation";

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
  const screenWidth = Dimensions.get("window").width;
  const { t } = useTranslation();

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;

    // Handle various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11 ? match[2] : url;
  };

  const videoId = movie.trailer ? getYouTubeVideoId(movie.trailer) : null;

  const infoBoxes = [
    { label: "⏱", value: t("HOME_DURATION_MINUTES", { minutes: movie.duration }) },
    { label: "⭐", value: `${movie.rating}` },
    { label: "🎞", value: movie.genres.map((g) => g.name).join(", ") },
  ];

  return (
    <PickView flex={1} backgroundColor={colors.background["bg-primary"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {movie.trailer && videoId && (
          <PickView
            style={{
              backgroundColor: "#000",
              width: "100%",
              aspectRatio: 16 / 9, // YouTube standard aspect ratio
            }}
          >
            <YoutubePlayer
              height={(screenWidth * 9) / 16} // Maintain 16:9 aspect ratio
              width={screenWidth}
              play={false}
              videoId={videoId}
            />
          </PickView>
        )}

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
              {t("MOVIE_DIRECTOR_LABEL")}: {movie.directors.map((d) => d.name).join(", ")}
            </PickText>
            <PickText size={13} style={{ marginBottom: 2 }}>
              {t("MOVIE_ACTOR_LABEL")}: {movie.actors.map((a) => a.name).join(", ")}
            </PickText>
            <PickView style={{ marginBottom: 2 }}>
              <PickText size={13} numberOfLines={2} ellipsizeMode="tail" lineHeight={20}>
                {t("MOVIE_DESCRIPTION_LABEL")}: {movie.description}
              </PickText>
            </PickView>
          </PickView>
        </PickView>
      </ScrollView>
    </PickView>
  );
};

export default MovieDetailScreen;
