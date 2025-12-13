import React from "react";
import { ScrollView } from "react-native";
import { PickView, ScreenHeader } from "@Components";
import { useRoute } from "@react-navigation/native";
import MovieReviews, { Review } from "./Components/MovieReview";
import { COLORS } from "@Constants/theme";
import { useTranslation } from "@Hooks/useTranslation";

interface RouteParams {
  movieId: number;
  movieName: string;
  reviews: Review[];
}

const MovieRatingScreen: React.FC = () => {
  const route = useRoute();
  const { movieId, movieName, reviews } = route.params as RouteParams;
  const { t } = useTranslation();

  return (
    <PickView flex={1} backgroundColor={COLORS.background}>
      {/* Header */}
      <ScreenHeader title={t("MOVIE_REVIEW_HEADER", { movie: movieName })} />

      {/* Scroll nội dung */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <MovieReviews reviews={reviews} movieId={movieId} />
      </ScrollView>
    </PickView>
  );
};

export default MovieRatingScreen;
