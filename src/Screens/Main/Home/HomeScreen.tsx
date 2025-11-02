import React from "react";
import { ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { PickView } from "@Components";
import { COLORS, SPACING, RADIUS } from "@Constants/theme";
import Header from "./Components/Header";
import Banner from "./Components/Banner";
import MovieSection from "./Components/MovieSection";
import { useMovieList } from "@Hooks/useMovieList";
import { useNavigation } from "@react-navigation/native";

// Mock banners
const mockBanners = [
  {
    id: "1",
    title: "Ưu đãi đặc biệt",
    subtitle: "Giảm 50% cho lần đặt vé đầu tiên",
    backgroundColor: "#e94560",
  },
  {
    id: "2",
    title: "Phim mới ra mắt",
    subtitle: "Những bộ phim blockbuster 2024",
    backgroundColor: "#3498db",
  },
  {
    id: "3",
    title: "Combo tiết kiệm",
    subtitle: "Vé + bỏng ngô + nước ngọt",
    backgroundColor: "#2ecc71",
  },
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();

  const {
    movies: nowShowing,
    isLoading: loadingNow,
    error: errorNow,
  } = useMovieList({ type: "nowShowing", limit: 10 });

  const {
    movies: comingSoon,
    isLoading: loadingComing,
    error: errorComing,
  } = useMovieList({ type: "comingSoon", limit: 10 });

  if (loadingNow || loadingComing) {
    return (
      <PickView flex={1} justifyCenter alignCenter>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </PickView>
    );
  }

  if (errorNow || errorComing) {
    console.log("Error fetching movies:", errorNow || errorComing);
  }

  const formatMovies = (movies: typeof nowShowing) => {
    const formatted = movies.map((m) => ({
      id: m.id.toString(),
      title: m.name,
      genre: m.genres.map((g) => g.name).join(", "),
      rating: m.rating,
      age: m.age ?? "P", // dùng default "P" nếu undefined
      graphics: m.graphics,
      duration: `${m.duration} phút`,
      imageUrl: m.poster,
    }));

    return formatted;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} bounces={false}>
      <Header />
      <PickView
        flex={1}
        style={styles.contentContainer}
        borderTopRadius={RADIUS.xl}
        backgroundColor={COLORS.background}
      >
        <Banner banners={mockBanners} />

        <MovieSection
          title="Phim đang chiếu"
          movies={formatMovies(nowShowing)}
          onSeeAll={() =>
            navigation.navigate("MovieList", {
              type: "nowShowing",
              title: "Phim đang chiếu",
              emptyText: "Không có phim nào đang chiếu",
            })
          }
        />

        <MovieSection
          title="Phim sắp chiếu"
          movies={formatMovies(comingSoon)}
          onSeeAll={() =>
            navigation.navigate("MovieList", {
              type: "comingSoon",
              title: "Phim sắp chiếu",
              emptyText: "Không có phim sắp chiếu",
            })
          }
        />
      </PickView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  contentContainer: {
    marginTop: -SPACING.lg,
    paddingTop: SPACING.xl,
    minHeight: 600,
  },
});

export default HomeScreen;
