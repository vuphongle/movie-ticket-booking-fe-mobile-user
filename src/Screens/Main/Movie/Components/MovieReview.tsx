import React, { useState, useMemo } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image } from "react-native";
import { useSelector } from "react-redux";
import { useLoginModal } from "@/contexts/LoginContext";
import { COLORS, SPACING, FONT_SIZE } from "@Constants/theme";
import { RootState } from "@app/Store";
import {
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} from "@app/services/review.api";
import * as ImagePicker from "expo-image-picker";

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

const MovieReviews: React.FC<MovieReviewsProps> = ({ reviews, movieId }) => {
  const { isAuthenticated, auth: user } = useSelector((state: RootState) => state.auth);
  const currentUserId = user?.id;
  const { openLogin } = useLoginModal();

  const [visibleReviews, setVisibleReviews] = useState(3);
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(10);
  const [files, setFiles] = useState<any[]>([]);

  const [createReview] = useCreateReviewMutation();
  const [updateReview] = useUpdateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const sortedReviews = useMemo(() => {
    return [...reviews].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [reviews]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
    });
    if (!result.canceled) {
      setFiles([...files, ...(result.assets || [])]);
    }
  };

  return (
    <View style={{ padding: SPACING.md }}>
      <Text style={{ fontWeight: "600", fontSize: FONT_SIZE.md, marginBottom: SPACING.sm }}>
        Đánh giá ({reviews.length})
      </Text>

      {/* Form đánh giá */}
      <View style={{ marginBottom: SPACING.md }}>
        <Text>Rating: {rating}/10</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {Array.from({ length: 10 }, (_, i) => (
            <TouchableOpacity key={i} onPress={() => setRating(i + 1)}>
              <Text style={{ fontSize: 24, color: i < rating ? "#facc15" : "#475569" }}>★</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          value={commentText}
          onChangeText={setCommentText}
          placeholder="Nhập bình luận..."
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 6,
            padding: SPACING.sm,
            marginTop: SPACING.sm,
          }}
        />

        <TouchableOpacity onPress={pickImage} style={{ marginTop: SPACING.sm }}>
          <Text>Chọn hình</Text>
        </TouchableOpacity>

        <ScrollView horizontal>
          {files.map((f, idx) => (
            <Image
              key={idx}
              source={{ uri: f.uri }}
              style={{ width: 60, height: 60, marginRight: SPACING.xs }}
            />
          ))}
        </ScrollView>

        <TouchableOpacity
          onPress={async () => {
            if (!isAuthenticated) {
              openLogin();
              return;
            }
            // handle createReview với FormData tương tự web
          }}
          style={{
            backgroundColor: COLORS.accent,
            padding: SPACING.sm,
            borderRadius: 6,
            marginTop: SPACING.sm,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff" }}>Gửi đánh giá</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách review */}
      {sortedReviews.slice(0, visibleReviews).map((r) => (
        <View
          key={r.id}
          style={{
            marginBottom: SPACING.md,
            backgroundColor: COLORS.surface,
            padding: SPACING.sm,
            borderRadius: 6,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: SPACING.xs }}>
            <Image
              source={{ uri: r.user.avatar }}
              style={{ width: 40, height: 40, borderRadius: 20, marginRight: SPACING.sm }}
            />
            <Text style={{ fontWeight: "600", flex: 1 }}>{r.user.name}</Text>
            <Text>⭐ {r.rating}</Text>
          </View>
          <Text style={{ marginBottom: SPACING.xs }}>{r.comment}</Text>
          <ScrollView horizontal>
            {r.images?.map((img, idx) => (
              <Image
                key={idx}
                source={{ uri: img }}
                style={{ width: 80, height: 80, marginRight: SPACING.xs }}
              />
            ))}
          </ScrollView>
        </View>
      ))}

      {visibleReviews < sortedReviews.length && (
        <TouchableOpacity onPress={() => setVisibleReviews((prev) => prev + 5)}>
          <Text style={{ color: COLORS.accent }}>Xem thêm</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MovieReviews;
