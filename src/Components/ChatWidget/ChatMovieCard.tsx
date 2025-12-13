import React from "react";
import { Image, TouchableOpacity } from "react-native";
import type { RecommendedMovie, RecommendedShowtime } from "@Types/chatTypes";
import { PickView, PickText } from "@Components";
import { parseBackendDate, toDisplayDate } from "@Utils/dateUtils";

interface ChatMovieCardProps {
  movie: RecommendedMovie;
  onPress?: (movieId: string, slug: string) => void;
  onShowtimePress?: (movie: RecommendedMovie, showtime: RecommendedShowtime) => void;
}

export const ChatMovieCard: React.FC<ChatMovieCardProps> = ({
  movie,
  onPress,
  onShowtimePress,
}) => {
  const handlePress = () => {
    const movieId = movie.movieId.toString();
    const slug = movie.slug || `phim-${movie.movieId}`;

    onPress?.(movieId, slug);
  };

  const renderShowtimes = () => {
    if (!movie.showtimes || movie.showtimes.length === 0) return null;
    return (
      <PickView row gap={8} flexWrap="wrap">
        {movie.showtimes.slice(0, 4).map((st) => {
          const dateText = toDisplayDate(parseBackendDate(st.date));
          const meta = [dateText, st.cinemaName].filter(Boolean).join(" • ");
          return (
            <TouchableOpacity
              key={`${movie.movieId}-${st.id}`}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 8,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#e0e0e0",
                backgroundColor: "#f4f6fb",
              }}
              activeOpacity={0.8}
              onPress={() => onShowtimePress?.(movie, st)}
            >
              <PickText size={13} style={{ fontWeight: "700", color: "#1a1a2e" }}>
                {st.startTime}
              </PickText>
              {meta ? (
                <PickText size={11} style={{ color: "#555", marginTop: 2 }}>
                  {meta}
                </PickText>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </PickView>
    );
  };

  const posterUrl = movie.poster || "https://via.placeholder.com/120x160?text=No+Image";
  const movieName = movie.name || "Chưa có tên";
  const rating = typeof movie.rating === "number" ? movie.rating.toFixed(1) : null;

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        backgroundColor: "#ffffff",
        borderRadius: 14,
        padding: 10,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
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
        <PickText size={14} variant="body_large" color="body" numberOfLines={2}>
          {movieName}
        </PickText>

        {(movie.ageRating || rating) && (
          <PickView row alignCenter gap={8}>
            {movie.ageRating && (
              <PickText size={12} color="body">
                {movie.ageRating}
              </PickText>
            )}
            {rating && (
              <PickText size={12} color="body">
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
                  backgroundColor: "#f5f5f5",
                  borderWidth: 1,
                  borderColor: "#e0e0e0",
                }}
              >
                <PickText size={11} color="body">
                  {genre}
                </PickText>
              </PickView>
            ))}
          </PickView>
        )}

        {movie.reasons && movie.reasons.length > 0 && (
          <PickView gap={4}>
            {movie.reasons.slice(0, 2).map((reason, index) => (
              <PickText key={`${movie.movieId}-reason-${index}`} size={12} color="body">
                • {reason}
              </PickText>
            ))}
          </PickView>
        )}

        {renderShowtimes()}

        <PickText size={12} style={{ color: "#6366f1", fontWeight: "600", marginTop: 4 }}>
          Xem chi tiết →
        </PickText>
      </PickView>
    </TouchableOpacity>
  );
};
