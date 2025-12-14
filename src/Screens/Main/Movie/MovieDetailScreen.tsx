import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, ActivityIndicator, View } from "react-native";
import { PickText, PickView, PickButton, ScreenHeader } from "@Components";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@Types/navigationTypes";
import useThemedStyles from "@Theme/Hook/useThemedStyles";

import MovieContent, { MovieContentProps } from "./Components/MovieContent";
import { Review } from "./Components/MovieReview";
import MovieSection from "@Screens/Main/Home/Components/MovieSection";
import { movieService } from "@Services/movie/movieService";
import { COLORS, SPACING, FONT_SIZE } from "@Constants/theme";
import { useTranslation } from "@Hooks/useTranslation";
import { getMovieTitle } from "@Utils";

type MovieSectionNavigationProp = NativeStackNavigationProp<RootStackParamList, "MovieList">;

enum MovieAge {
  P = "P",
  K = "K",
  T13 = "T13",
  T16 = "T16",
  T18 = "T18",
  C = "C",
}

interface MovieItem {
  id: string;
  name: string;
  nameEn?: string | null;
  genre: string;
  age: MovieAge;
  slug: string;
  graphics: string[];
  rating: number;
  duration: string;
  imageUrl?: string;
}

const MovieDetailScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<MovieSectionNavigationProp>();
  const insets = useSafeAreaInsets();
  const { colors, spacing } = useThemedStyles();
  const { id, slug } = route.params as { id: string; slug: string };
  const { t, language } = useTranslation();

  const [movie, setMovie] = useState<MovieContentProps["movie"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [nowShowingMovies, setNowShowingMovies] = useState<MovieItem[]>([]);
  const [isNowShowing, setIsNowShowing] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const movieDetail = await movieService.getMovieDetail(Number(id), slug);
        setMovie({
          ...movieDetail,
          country: movieDetail.country,
        });

        const moviesNow = await movieService.getShowingNowMovies();

        setIsNowShowing(moviesNow.some((m) => m.id === Number(id)));

        setNowShowingMovies(
          moviesNow.map((m) => ({
            id: m.id.toString(),
            name: getMovieTitle(m, language),
            genre: m.genres.map((g) => g.name).join(", "),
            age: m.age as MovieAge,
            slug: m.slug,
            graphics: m.graphics,
            rating: m.rating,
            duration: t("HOME_DURATION_MINUTES", { minutes: m.duration }),
            imageUrl: m.poster,
          }))
        );

        setReviews(movieDetail.reviews || []);
      } catch (err: any) {
        console.error(err);
        setError(t("MOVIE_DETAIL_ERROR"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, slug, language, t]);

  if (loading)
    return (
      <PickView style={styles.center}>
        <ActivityIndicator size="large" color={colors.background["bg-brand-quaternary"]} />
        <PickText size={16} style={{ marginTop: spacing.s16, color: colors.text.body }}>
          {t("MOVIE_DETAIL_LOADING")}
        </PickText>
      </PickView>
    );

  if (error)
    return (
      <PickView style={styles.center}>
        <PickText style={styles.errorText}>{error}</PickText>
      </PickView>
    );

  if (!movie)
    return (
      <PickView style={styles.center}>
        <PickText style={styles.errorText}>{t("MOVIE_DETAIL_NOT_FOUND")}</PickText>
      </PickView>
    );

  const displayMovieName = getMovieTitle(movie, language);

  return (
    <PickView style={styles.container}>
      <ScreenHeader title={t("MOVIE_DETAIL_TITLE")} />

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 50,
        }}
      >
        <MovieContent movie={movie} />

        {isNowShowing && (
          <PickView paddingHorizontal={SPACING.md} marginBottom={SPACING.md}>
            <PickButton
              title={t("MOVIE_DETAIL_REVIEWS_BUTTON", { count: reviews.length })}
              type="Secondary"
              size="sm"
              onPress={() =>
                navigation.navigate("MovieRating", {
                  movieId: Number(id),
                  movieName: displayMovieName,
                  reviews,
                })
              }
            />
          </PickView>
        )}

        <MovieSection
          title={t("MOVIE_DETAIL_NOW_SHOWING")}
          movies={nowShowingMovies.slice(0, 5)}
          onSeeAll={() =>
            navigation.navigate("MovieList", {
              type: "nowShowing",
              title: t("MOVIE_DETAIL_NOW_SHOWING"),
              emptyText: t("MOVIE_DETAIL_NOW_SHOWING_EMPTY"),
            })
          }
        />
      </ScrollView>

      {isNowShowing && (
        <View style={[styles.bookingButtonContainer, { bottom: insets.bottom + 12 }]}>
          <PickButton
            type="Primary"
            title={t("MOVIE_DETAIL_BOOK")}
            onPress={() =>
              navigation.navigate("MovieShowtime", {
                movieId: Number(id),
                movieName: displayMovieName,
                slug,
              })
            }
          />
        </View>
      )}
    </PickView>
  );
};

export default MovieDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.md,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.md,
  },
  bookingButtonContainer: {
    position: "absolute",
    left: SPACING.lg,
    right: SPACING.lg,
    zIndex: 20,
  },
});
