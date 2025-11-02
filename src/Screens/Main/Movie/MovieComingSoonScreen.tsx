import React from "react";
import { ScrollView, ActivityIndicator } from "react-native";
import { PickView, PickText } from "@Components";
import { useMovieList } from "@Hooks/useMovieList";
import MovieSection from "../Home/Components/MovieSection";
import { COLORS, SPACING } from "@Constants/theme";

/**
 * Màn hình hiển thị danh sách phim sắp chiếu.
 * - Gọi hook `useMovieList` để lấy dữ liệu phim.
 * - Hiển thị loading khi đang tải.
 * - Hiển thị lỗi khi tải thất bại.
 * - Hiển thị danh sách phim khi có dữ liệu.
 */
const MovieComingSoonScreen: React.FC = () => {
  const { movies, isLoading, error } = useMovieList({ type: "comingSoon" });

  // Hiển thị vòng tròn loading khi đang tải phim
  if (isLoading) {
    return (
      <PickView flex={1} justifyCenter alignCenter backgroundColor={COLORS.primary}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <PickText size={16} style={{ color: "#fff", marginTop: SPACING.md }}>
          Đang tải phim sắp chiếu...
        </PickText>
      </PickView>
    );
  }

  // Hiển thị thông báo lỗi khi không tải được phim
  if (error) {
    return (
      <PickView flex={1} justifyCenter alignCenter backgroundColor={COLORS.primary}>
        <PickText size={16} style={{ color: "#fff", marginBottom: SPACING.sm }}>
          Có lỗi xảy ra khi tải phim
        </PickText>
      </PickView>
    );
  }

  // Hiển thị danh sách phim hoặc thông báo khi không có phim
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: COLORS.primary }}
      contentContainerStyle={{ padding: SPACING.lg }}
    >
      <PickText size={24} font="bold" style={{ color: "#fff", marginBottom: SPACING.md }}>
        Phim sắp chiếu
      </PickText>

      {movies && movies.length > 0 ? (
        <MovieSection
          title=""
          movies={movies.map((m) => ({
            id: m.id.toString(),
            title: m.name,
            genre: m.genres.map((g) => g.name).join(", "),
            rating: m.rating,
            age: m.age ?? "P",
            graphics: m.graphics,
            duration: `${m.duration} phút`,
            imageUrl: m.poster,
          }))}
        />
      ) : (
        <PickText size={16} style={{ color: "#fff", textAlign: "center" }}>
          Không có phim sắp chiếu
        </PickText>
      )}
    </ScrollView>
  );
};

export default MovieComingSoonScreen;
