import React, { useState, useMemo } from "react";
import { ScrollView, TouchableOpacity, Image } from "react-native";
import { COLORS, SPACING, FONT_SIZE } from "@Constants/theme";
import { PickText, PickView, PickInput, PickButton } from "@Components";

export interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  images: string[];
  user: { id: number; name: string; avatar: string };
}

interface MovieReviewsProps {
  reviews: Review[];
  movieId: number;
}

const MovieReviews: React.FC<MovieReviewsProps> = ({ reviews }) => {
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(10);

  const sortedReviews = useMemo(
    () =>
      [...reviews].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ),
    [reviews]
  );

  return (
    <PickView padding={SPACING.md}>
      <PickText
        font="bold"
        size={FONT_SIZE.xl}
        style={{
          marginBottom: SPACING.xs,
          color: COLORS.text.primary,
          fontSize: FONT_SIZE.xl,
          fontWeight: "bold",
        }}
      >
        Đánh giá ({reviews.length})
      </PickText>

      <PickView style={{ marginBottom: SPACING.md }}>
        <PickText font="bold" size={FONT_SIZE.md} style={{ marginBottom: SPACING.sm }}>
          Rating: {rating}/10
        </PickText>

        <PickView row style={{ flexWrap: "wrap" }}>
          {Array.from({ length: 10 }, (_, i) => (
            <TouchableOpacity key={i} onPress={() => setRating(i + 1)}>
              <PickText size={24} style={{ color: i < rating ? "#facc15" : "#475569" }}>
                ★
              </PickText>
            </TouchableOpacity>
          ))}
        </PickView>

        <PickInput
          value={commentText}
          onChangeText={setCommentText}
          placeholder="Nhập bình luận..."
          containerStyle={{ marginTop: SPACING.sm }}
        />

        <PickButton
          title="Gửi đánh giá"
          type="Primary"
          size="md"
          onPress={() => console.log({ comment: commentText, rating })}
        />
      </PickView>

      {sortedReviews.slice(0, visibleReviews).map((r) => (
        <PickView
          key={r.id}
          padding={SPACING.sm}
          style={{ marginBottom: SPACING.md, borderRadius: 6, backgroundColor: COLORS.surface }}
        >
          <PickView row alignCenter style={{ marginBottom: SPACING.xs }}>
            <Image
              source={
                r.user.avatar?.includes("http") &&
                r.user.avatar.includes("go-cinema.s3.ap-southeast-1.amazonaws.com")
                  ? { uri: r.user.avatar }
                  : require("@Assets/images/default-avatar.jpg")
              }
              style={{ width: 40, height: 40, borderRadius: 20, marginRight: SPACING.sm }}
            />

            <PickText font="semibold" style={{ flex: 1 }}>
              {r.user.name}
            </PickText>
            <PickText>⭐ {r.rating}</PickText>
          </PickView>

          <PickText style={{ marginBottom: SPACING.xs }}>{r.comment}</PickText>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {r.images?.map((img, idx) => (
              <Image
                key={idx}
                source={{ uri: img }}
                style={{ width: 80, height: 80, marginRight: SPACING.xs }}
              />
            ))}
          </ScrollView>
        </PickView>
      ))}

      {visibleReviews < sortedReviews.length && (
        <PickView alignItems="center">
          <PickButton
            title="Xem thêm"
            type="Primary"
            size="md"
            onPress={() => setVisibleReviews((prev) => prev + 5)}
            style={{
              paddingHorizontal: SPACING.lg,
              paddingVertical: SPACING.sm,
              borderRadius: 8,
            }}
          />
        </PickView>
      )}
    </PickView>
  );
};

export default MovieReviews;
