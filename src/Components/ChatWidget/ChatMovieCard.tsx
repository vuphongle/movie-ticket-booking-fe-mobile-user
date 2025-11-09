import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import type { RecommendedMovie } from "@Types/chatTypes";

interface ChatMovieCardProps {
  movie: RecommendedMovie;
  onPress?: (movieId: string, slug: string) => void;
}

export const ChatMovieCard: React.FC<ChatMovieCardProps> = ({ movie, onPress }) => {
  const handlePress = () => {
    const movieId = movie.movieId.toString();
    const slug = movie.slug || `phim-${movie.movieId}`;

    onPress?.(movieId, slug);
  };

  const posterUrl = movie.poster || "https://via.placeholder.com/120x160?text=No+Image";
  const movieName = movie.name || "Chưa có tên";
  const rating = typeof movie.rating === "number" ? movie.rating.toFixed(1) : null;

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      <Image source={{ uri: posterUrl }} style={styles.poster} resizeMode="cover" />

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {movieName}
        </Text>

        {(movie.ageRating || rating) && (
          <View style={styles.meta}>
            {movie.ageRating && <Text style={styles.metaText}>{movie.ageRating}</Text>}
            {rating && <Text style={styles.metaText}>⭐ {rating}</Text>}
          </View>
        )}

        {movie.genreDisplayNames && movie.genreDisplayNames.length > 0 && (
          <View style={styles.genres}>
            {movie.genreDisplayNames.slice(0, 3).map((genre, index) => (
              <View key={`${movie.movieId}-${genre}-${index}`} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre}</Text>
              </View>
            ))}
          </View>
        )}

        {movie.reasons && movie.reasons.length > 0 && (
          <View style={styles.reasons}>
            {movie.reasons.slice(0, 2).map((reason, index) => (
              <Text key={`${movie.movieId}-reason-${index}`} style={styles.reasonText}>
                • {reason}
              </Text>
            ))}
          </View>
        )}

        <Text style={styles.viewDetails}>Xem chi tiết →</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "rgba(15, 23, 42, 0.35)",
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.15)",
  },
  poster: {
    width: 72,
    height: 100,
    borderRadius: 12,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    gap: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f8fafc",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaText: {
    fontSize: 12,
    color: "rgba(226, 232, 240, 0.75)",
  },
  genres: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  genreTag: {
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  genreText: {
    fontSize: 11,
    color: "#bfdbfe",
  },
  reasons: {
    gap: 4,
  },
  reasonText: {
    fontSize: 12,
    color: "rgba(226, 232, 240, 0.75)",
  },
  viewDetails: {
    fontSize: 12,
    color: "#60a5fa",
    fontWeight: "600",
    marginTop: 4,
  },
});
