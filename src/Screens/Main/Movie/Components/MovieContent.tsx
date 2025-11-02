import React from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { Clock, Star, Film, Calendar } from "lucide-react-native";
import { useTranslation } from "react-i18next";

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
  };
}

const MovieContent: React.FC<MovieContentProps> = ({ movie }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* Poster */}
      <Image source={{ uri: movie.poster }} style={styles.poster} />

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.title}>{movie.name}</Text>
        <Text style={styles.subTitle}>{movie.nameEn}</Text>

        {/* Meta */}
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Clock width={18} height={18} color="#38bdf8" />
            <Text>
              {movie.duration} {t("MOVIE_MINUTES")}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Star width={18} height={18} color="#38bdf8" />
            <Text>{movie.rating}</Text>
          </View>
          <View style={styles.metaItem}>
            <Film width={18} height={18} color="#38bdf8" />
            <Text>{movie.genres.map((g) => g.name).join(", ")}</Text>
          </View>
          <View style={styles.metaItem}>
            <Calendar width={18} height={18} color="#38bdf8" />
            <Text>{new Date(movie.showDate).toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Directors */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("MOVIE_DIRECTORS")}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {movie.directors.map((d) => (
              <View key={d.id} style={styles.avatarItem}>
                <Image source={{ uri: d.avatar }} style={styles.avatarImage} />
                <Text style={styles.avatarName}>{d.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Actors */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("MOVIE_ACTORS")}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {movie.actors.map((a) => (
              <View key={a.id} style={styles.avatarItem}>
                <Image source={{ uri: a.avatar }} style={styles.avatarImage} />
                <Text style={styles.avatarName}>{a.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default MovieContent;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 24,
  },
  poster: {
    width: 150,
    height: 225,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    backgroundColor: "#1f1f1f",
    borderRadius: 8,
    padding: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 14,
    color: "#94a3b8",
    fontStyle: "italic",
    marginBottom: 8,
  },
  meta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    color: "#94a3b8",
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#374151",
    paddingBottom: 4,
  },
  avatarItem: {
    alignItems: "center",
    marginRight: 12,
  },
  avatarImage: {
    width: 72,
    height: 108,
    borderRadius: 6,
  },
  avatarName: {
    marginTop: 4,
    fontSize: 12,
    color: "#94a3b8",
    textAlign: "center",
  },
});
