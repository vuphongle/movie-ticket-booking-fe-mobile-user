import React from "react";
import { ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { PickView, ChatWidget } from "@Components";
import { SPACING, RADIUS } from "@Constants/theme";
import Header from "./Components/Header";
import Banner from "./Components/Banner";
import MovieSection from "./Components/MovieSection";
import { useMovieList } from "@Hooks/useMovieList";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@Types/navigationTypes";
import useThemedStyles from "@Theme/Hook/useThemedStyles";
import { useTranslation } from "@Hooks/useTranslation";
import { getMovieTitle } from "@Utils";

type MovieSectionNavigationProp = NativeStackNavigationProp<RootStackParamList, "MovieList">;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<MovieSectionNavigationProp>();
  const { colors } = useThemedStyles();
  const { t, language } = useTranslation();

  const mockBanners = [
    {
      id: "1",
      title: t("HOME_BANNER_SPECIAL_TITLE"),
      subtitle: t("HOME_BANNER_SPECIAL_SUBTITLE"),
      backgroundColor: "#e94560",
      image: require("@Assets/images/banner2.png"),
    },
    {
      id: "2",
      title: t("HOME_BANNER_NEW_TITLE"),
      subtitle: t("HOME_BANNER_NEW_SUBTITLE"),
      backgroundColor: "#3498db",
      image: require("@Assets/images/banner4.png"),
    },
    {
      id: "3",
      title: t("HOME_BANNER_COMBO_TITLE"),
      subtitle: t("HOME_BANNER_COMBO_SUBTITLE"),
      backgroundColor: "#2ecc71",
      image: require("@Assets/images/banner3.png"),
    },
  ];

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
        <ActivityIndicator size="large" color={colors.background["bg-brand-quaternary"]} />
      </PickView>
    );
  }

  if (errorNow || errorComing) {
    console.log("Error fetching movies:", errorNow || errorComing);
  }

  const formatMovies = (movies: typeof nowShowing) => {
    const formatted = movies.map((m) => ({
      id: m.id.toString(),
      name: getMovieTitle(m, language),
      slug: m.slug,
      genre: m.genres.map((g) => g.name).join(", "),
      rating: m.rating,
      age: m.age ?? "P",
      graphics: m.graphics,
      duration: t("HOME_DURATION_MINUTES", { minutes: m.duration }),
      imageUrl: m.poster,
    }));

    return formatted;
  };

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background["bg-secondary"] }}
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ paddingBottom: SPACING.xxl * 2 }}
      >
        <Header />
        <PickView
          flex={1}
          style={styles.contentContainer}
          borderTopRadius={RADIUS.xl}
          backgroundColor={colors.background["bg-secondary"]}
        >
          <Banner banners={mockBanners} />

          <MovieSection
            title={t("HOME_SECTION_NOW_SHOWING")}
            movies={formatMovies(nowShowing.slice(0, 7))}
            onSeeAll={() =>
              navigation.navigate("MovieList", {
                type: "nowShowing",
                title: t("HOME_SECTION_NOW_SHOWING"),
                emptyText: t("HOME_SECTION_NOW_SHOWING_EMPTY"),
              })
            }
          />

          <MovieSection
            title={t("HOME_SECTION_COMING_SOON")}
            movies={formatMovies(comingSoon.slice(0, 7))}
            onSeeAll={() =>
              navigation.navigate("MovieList", {
                type: "comingSoon",
                title: t("HOME_SECTION_COMING_SOON"),
                emptyText: t("HOME_SECTION_COMING_SOON_EMPTY"),
              })
            }
          />
        </PickView>
      </ScrollView>
      <ChatWidget />
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    marginTop: -SPACING.lg,
    paddingTop: SPACING.xl,
    minHeight: 600,
  },
});

export default HomeScreen;
