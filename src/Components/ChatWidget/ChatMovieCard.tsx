import React from "react";
import { Image, TouchableOpacity } from "react-native";
import type { RecommendedMovie } from "@Types/chatTypes";
import { PickView, PickText } from "@Components";

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
    <TouchableOpacity
      style={{
        flexDirection: "row",
        backgroundColor: "rgba(15, 23, 42, 0.35)",
        borderRadius: 14,
        padding: 10,
        borderWidth: 1,
        borderColor: "rgba(148, 163, 184, 0.15)",
      }}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: posterUrl }}
        style={{ width: 72, height: 100, borderRadius: 12 }}
        resizeMode="cover"
      />

      <PickView flex={1} marginLeft={12} gap={6}>
        <PickText size={14} variant="body_large" color="body-inverted" numberOfLines={2}>
          {movieName}
        </PickText>

        {(movie.ageRating || rating) && (
          <PickView row alignCenter gap={8}>
            {movie.ageRating && (
              <PickText size={12} color="body-inverted">
                {movie.ageRating}
              </PickText>
            )}
            {rating && (
              <PickText size={12} color="body-inverted">
                ⭐ {rating}
              </PickText>
            )}
          </PickView>
        )}

        {movie.genreDisplayNames && movie.genreDisplayNames.length > 0 && (
          <PickView row gap={6} flexWrap="wrap">
            {movie.genreDisplayNames.slice(0, 3).map((genre, index) => (
              <PickView
                key={`${movie.movieId}-${genre}-${index}`}
                paddingHorizontal={6}
                paddingVertical={2}
                borderRadius={8}
                style={{
                  backgroundColor: "rgba(59, 130, 246, 0.15)",
                }}
              >
                <PickText size={11} color="body-inverted">
                  {genre}
                </PickText>
              </PickView>
            ))}
          </PickView>
        )}

        {movie.reasons && movie.reasons.length > 0 && (
          <PickView gap={4}>
            {movie.reasons.slice(0, 2).map((reason, index) => (
              <PickText key={`${movie.movieId}-reason-${index}`} size={12} color="body-on-brand">
                • {reason}
              </PickText>
            ))}
          </PickView>
        )}

        <PickText size={12} style={{ color: "#60a5fa", fontWeight: "600", marginTop: 4 }}>
          Xem chi tiết →
        </PickText>
      </PickView>
    </TouchableOpacity>
  );
};
