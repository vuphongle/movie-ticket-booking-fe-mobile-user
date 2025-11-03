import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { PickText, PickView, ScreenHeader } from "@Components";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useThemedStyles from "@Theme/Hook/useThemedStyles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@Types/navigationTypes";

import MovieContent, { MovieContentProps } from "./Components/MovieContent";
import MovieReviews, { Review } from "./Components/MovieReview";
import MovieSection from "@Screens/Main/Home/Components/MovieSection";
import { movieService } from "@Services/movie/movieService";
import { COLORS, SPACING, FONT_SIZE } from "@Constants/theme";

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
  const { colors } = useThemedStyles();
  const { id, slug } = route.params as { id: string; slug: string };

  const [movie, setMovie] = useState<MovieContentProps["movie"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nowShowingMovies, setNowShowingMovies] = useState<MovieItem[]>([]);
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
        setNowShowingMovies(
          moviesNow.map((m) => ({
            id: m.id.toString(),
            name: m.name,
            genre: m.genres.map((g) => g.name).join(", "),
            age: m.age as MovieAge,
            slug: m.slug,
            graphics: m.graphics,
            rating: m.rating,
            duration: `${m.duration} phút`,
            imageUrl: m.poster,
          }))
        );

        setReviews(movieDetail.reviews || []);
      } catch (err: any) {
        console.error(err);
        setError("Không thể tải dữ liệu phim.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, slug]);

  if (loading)
    return (
      <PickView style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.accent} />
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
        <PickText style={styles.errorText}>Phim không tồn tại.</PickText>
      </PickView>
    );

  return (
    <PickView style={styles.container}>
      <PickView style={{ position: "absolute", top: insets.top, left: 0, right: 0, zIndex: 10 }}>
        <ScreenHeader
          title="Chi tiết phim"
          backgroundColor={colors.background["bg-brand-quaternary"]}
        />
      </PickView>

      <ScrollView
        contentContainerStyle={{ paddingTop: 56 + insets.top, paddingBottom: SPACING.xl }}
      >
        <MovieContent movie={movie} />

        <PickView style={styles.showtimeBlock}>
          <PickText style={styles.sectionTitle}>Lịch chiếu</PickText>
          <PickText>Thông tin lịch chiếu sẽ hiển thị tại đây (chưa triển khai).</PickText>
        </PickView>

        <MovieSection
          title="Phim đang chiếu"
          movies={nowShowingMovies.slice(0, 5)}
          onSeeAll={() =>
            navigation.navigate("MovieList", {
              type: "nowShowing",
              title: "Phim đang chiếu",
              emptyText: "Không có phim nào đang chiếu",
            })
          }
        />

        <PickView style={{ marginTop: SPACING.lg }}>
          <MovieReviews reviews={reviews} movieId={Number(id)} />
        </PickView>
      </ScrollView>
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
  showtimeBlock: {
    marginVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  sectionTitle: {
    color: COLORS.text.primary,
    fontSize: FONT_SIZE.xl,
    fontWeight: "bold",
    marginBottom: SPACING.sm,
  },
});
