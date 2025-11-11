import React from "react";
import { ScrollView } from "react-native";
import { PickView, ScreenHeader } from "@Components";
import { useRoute } from "@react-navigation/native";
import MovieReviews, { Review } from "./Components/MovieReview";
import { COLORS } from "@Constants/theme";

interface RouteParams {
  movieId: number;
  movieName: string;
  reviews: Review[];
}

const MovieRatingScreen: React.FC = () => {
  const route = useRoute();
  const { movieId, movieName, reviews } = route.params as RouteParams;

  return (
    <PickView flex={1} backgroundColor={COLORS.background}>
      {/* Header */}
      <ScreenHeader title={`Đánh giá - ${movieName}`} />

      {/* Scroll nội dung */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <MovieReviews reviews={reviews} movieId={movieId} />
      </ScrollView>
    </PickView>
  );
};

export default MovieRatingScreen;
