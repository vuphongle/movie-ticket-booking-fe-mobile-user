import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import type { RootStackNavigationProp } from "@Types/navigationTypes";
import { ChatFloatingButton } from "./ChatFloatingButton";
import { ChatWindow } from "./ChatWindow";
import UniversalConfirmModal from "@Components/Modals/UniversalConfirmModal";
import { useAuth } from "@Contexts/AuthContext";
import type { RecommendedMovie, RecommendedShowtime } from "@Types/chatTypes";
import { parseBackendDate, toISODate } from "@Utils/dateUtils";

/**
 * ChatWidget Component
 * Main component that combines floating button and chat window
 * This should be rendered at the root level (App.tsx or RootNavigator)
 */
export const ChatWidget: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigation = useNavigation<RootStackNavigationProp>();
  const { state } = useAuth();
  const isAuthenticated = state.isAuthenticated;

  const handleOpen = () => {
    setIsVisible(true);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleMoviePress = (movieId: string, slug: string) => {
    // Close chat window first
    setIsVisible(false);

    // Navigate after a short delay to allow modal animation
    setTimeout(() => {
      navigation.navigate("MovieDetail", { id: movieId, slug });
    }, 300);
  };

  const buildFormatKey = (graphicsType?: string | null, translationType?: string | null) => {
    if (!graphicsType) return "";
    const normalizedGraphics = graphicsType.replace(/_/g, " ");
    const normalizedTranslation = translationType ? translationType.trim().toUpperCase() : "";
    return normalizedTranslation
      ? `SHOWTIME_${normalizedGraphics}_${normalizedTranslation}`
      : `SHOWTIME_${normalizedGraphics}`;
  };

  const formatDateForRoute = (date: RecommendedShowtime["date"]) => {
    const parsed = parseBackendDate(date);
    if (parsed) return toISODate(parsed);
    if (typeof date === "string" || typeof date === "number") return String(date);
    return "";
  };

  const handleShowtimePress = (movie: RecommendedMovie, showtime: RecommendedShowtime) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    const slug = movie.slug || `phim-${movie.movieId}`;
    const dateStr = formatDateForRoute(showtime.date);
    const format = buildFormatKey(showtime.graphicsType, showtime.translationType);

    // Close chat then navigate
    setIsVisible(false);
    setTimeout(() => {
      navigation.navigate("SelectSeat", {
        showtimeId: showtime.id,
        cinema: {
          id: showtime.cinemaId,
          name: showtime.cinemaName ?? "",
          location: showtime.cinemaAddress ?? "",
        },
        auditorium: {
          id: showtime.auditoriumId ?? 0,
          name: showtime.auditoriumName ?? "",
          type: showtime.auditoriumType ?? "",
          totalSeats: showtime.auditoriumTotalSeats ?? 0,
          totalRows: showtime.auditoriumTotalRows ?? 0,
          totalColumns: showtime.auditoriumTotalColumns ?? 0,
        },
        time: showtime.startTime,
        date: dateStr,
        format,
        slug,
      });
    }, 300);
  };

  return (
    <>
      <ChatFloatingButton onPress={handleOpen} />
      <ChatWindow
        visible={isVisible}
        onClose={handleClose}
        onMoviePress={handleMoviePress}
        onShowtimePress={handleShowtimePress}
      />
      <UniversalConfirmModal
        visible={showLoginModal}
        title="Đăng nhập để đặt vé"
        description="Vui lòng đăng nhập để tiếp tục chọn ghế và thanh toán."
        confirmText="Đăng nhập"
        cancelText="Đóng"
        onConfirm={() => {
          setShowLoginModal(false);
          navigation.navigate("Login");
        }}
        onCancel={() => setShowLoginModal(false)}
      />
    </>
  );
};
