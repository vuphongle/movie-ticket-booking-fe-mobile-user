import React from "react";
import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { PickView, PickText } from "@Components";
import { COLORS, SPACING, FONT_SIZE } from "@Constants/theme";
import MovieCard from "./MovieCard";
import { MovieAge } from "@Types/movieTypes";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@Types/navigationTypes";
import { useTranslation } from "@Hooks/useTranslation";
import { getMovieTitle } from "@Utils";

type MovieSectionNavigationProp = NativeStackNavigationProp<RootStackParamList, "MovieDetail">;

interface Movie {
  id: string;
  name: string;
  nameEn?: string | null;
  slug: string;
  genre: string;
  age: MovieAge;
  graphics: string[];
  rating: number;
  duration: string;
  imageUrl?: string;
}

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  onSeeAll?: () => void;
}

const MovieSection: React.FC<MovieSectionProps> = ({ title, movies, onSeeAll }) => {
  const navigation = useNavigation<MovieSectionNavigationProp>();
  const { t, language } = useTranslation();
  return (
    <PickView style={styles.container}>
      <PickView row justifySpaceBetween alignCenter style={styles.header}>
        <PickText style={styles.sectionTitle}>{title}</PickText>
        {onSeeAll && (
          <TouchableOpacity onPress={onSeeAll}>
            <PickText style={styles.seeAllText}>{t("HOME_SEE_ALL")}</PickText>
          </TouchableOpacity>
        )}
      </PickView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            name={getMovieTitle(movie, language)}
            genre={movie.genre}
            age={movie.age}
            graphics={movie.graphics}
            rating={movie.rating}
            duration={movie.duration}
            imageUrl={movie.imageUrl}
            onPress={() => navigation.navigate("MovieDetail", { id: movie.id, slug: movie.slug })}
          />
        ))}
      </ScrollView>
    </PickView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.xl,
  },
  header: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    color: COLORS.text.primary,
    fontSize: FONT_SIZE.xl,
    fontWeight: "bold",
  },
  seeAllText: {
    color: COLORS.accent,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },
  scrollContainer: {
    paddingLeft: SPACING.md,
    paddingRight: SPACING.xs, // Small padding to show the edge of the last card
  },
});

export default MovieSection;
