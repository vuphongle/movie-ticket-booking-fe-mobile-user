import React, { useState, useMemo, useEffect } from "react";
import { ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { PickView, PickText, PickInput, PickButton } from "@Components";
import { COLORS, SPACING, FONT_SIZE, RADIUS } from "@Constants/theme";
import UniversalConfirmModal from "@Components/Modals/UniversalConfirmModal";
import EditReviewModal from "@Components/Modals/EditReviewModal";
import { launchImageLibrary, Asset } from "react-native-image-picker";
import { useAuth } from "@Contexts/AuthContext";
import { movieService } from "@Services/movie/movieService";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icon2 from "react-native-vector-icons/Ionicons";

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

type LocalImage = {
  uri: string;
  type: string;
  name: string;
  isRemote?: boolean;
};

const MovieReviews: React.FC<MovieReviewsProps> = ({ reviews, movieId }) => {
  const { state } = useAuth();
  const { isAuthenticated, user } = state;

  const currentUserId = user?.sub;

  const [localReviews, setLocalReviews] = useState<Review[]>(reviews);

  useEffect(() => {
    setLocalReviews(reviews);
  }, [reviews]);

  const [visibleReviews, setVisibleReviews] = useState(3);

  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(10);
  const [images, setImages] = useState<LocalImage[]>([]);

  const [editMode, setEditMode] = useState(false);
  const [reviewEditing, setReviewEditing] = useState<Review | null>(null);

  const [deleteModal, setDeleteModal] = useState(false);
  const [emptyTextNotificationModal, setEmptyTextNotificationModal] = useState(false);
  const [successCreateReviewModal, setSuccessCreateReviewModal] = useState(false);
  const [successUpdateReviewModal, setSuccessUpdateReviewModal] = useState(false);
  const [successDeleteReviewModal, setSuccessDeleteReviewModal] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const [errorReviewModal, setErrorReviewModal] = useState<{
    visible: boolean;
    message: string;
  }>({ visible: false, message: "" });
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);

  const sortedReviews = useMemo(() => {
    return [...localReviews].sort((a, b) => {
      const aIsCurrent = String(a.user.id) === String(currentUserId);
      const bIsCurrent = String(b.user.id) === String(currentUserId);

      if (aIsCurrent && !bIsCurrent) return -1;
      if (bIsCurrent && !aIsCurrent) return 1;

      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [localReviews, currentUserId]);

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000;

    if (diff < 60) return "Vừa xong";
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày trước`;

    return date.toLocaleDateString("vi-VN");
  };

  const pickImages = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      selectionLimit: 5,
      quality: 0.8,
    });

    if (result.didCancel) return;

    if (result.errorCode) {
      Alert.alert("Lỗi", "Không thể mở thư viện ảnh.");
      return;
    }

    if (result.assets && result.assets.length > 0) {
      const validAssets = result.assets.filter(
        (a: Asset) => a.type && a.type.startsWith("image/") && a.uri
      );

      if (validAssets.length !== result.assets.length) {
        Alert.alert("Lưu ý", "Một số file không phải hình ảnh nên đã bị bỏ qua.");
      }

      const newImages: LocalImage[] = validAssets.map((a, idx) => ({
        uri: a.uri!,
        type: a.type || "image/jpeg",
        name: a.fileName || `image_${Date.now()}_${idx}.jpg`,
        isRemote: false,
      }));

      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      Alert.alert("Thông báo", "Bạn cần đăng nhập để đánh giá.");
      return;
    }

    if (!commentText.trim()) {
      setEmptyTextNotificationModal(true);
      return;
    }

    const formData = new FormData();
    formData.append("movieId", String(movieId));
    formData.append("userId", String(currentUserId));
    formData.append("comment", commentText.trim());
    formData.append("rating", String(rating));

    images.forEach((img) => {
      if (img.isRemote) return;
      formData.append("files", {
        uri: img.uri,
        type: img.type,
        name: img.name,
      } as any);
    });

    try {
      const createdReview = await movieService.createReview(formData);
      if (createdReview) {
        setLocalReviews((prev) => [createdReview, ...prev]);
      }

      setSuccessCreateReviewModal(true);

      setCommentText("");
      setRating(10);
      setImages([]);
      setEditMode(false);
      setReviewEditing(null);
    } catch (err: any) {
      console.log("Create review error:", err);

      const message =
        err?.message || err?.originalError?.response?.data?.message || "Không thể gửi đánh giá.";

      setErrorReviewModal({
        visible: true,
        message,
      });
    }
  };

  const startEdit = (review: Review) => {
    setReviewEditing(review);
    setCommentText(review.comment);
    setImages([]);
    setRating(review.rating);
    setEditModalVisible(true);
  };

  const handleUpdateReview = async () => {
    if (!reviewEditing) return;

    if (!commentText.trim()) {
      setEmptyTextNotificationModal(true);
      return;
    }

    const formData = new FormData();
    formData.append("reviewId", String(reviewEditing.id));
    formData.append("movieId", String(movieId));
    formData.append("comment", commentText.trim());
    formData.append("rating", String(rating));

    images.forEach((img) => {
      if (img.isRemote) return;
      formData.append("files", {
        uri: img.uri,
        type: img.type,
        name: img.name,
      } as any);
    });

    try {
      const updatedReview = await movieService.updateReview(formData);
      if (updatedReview) {
        setLocalReviews((prev) => prev.map((r) => (r.id === updatedReview.id ? updatedReview : r)));
      }

      setSuccessUpdateReviewModal(true);

      setEditMode(false);
      setReviewEditing(null);
      setCommentText("");
      setRating(10);
      setImages([]);
    } catch (err) {
      console.log("Update review error:", err);
      Alert.alert("Lỗi", "Không thể cập nhật đánh giá.");
    }
  };

  const confirmDelete = async () => {
    if (!reviewToDelete) return;

    try {
      await movieService.deleteReview(reviewToDelete.id);
      setLocalReviews((prev) => prev.filter((r) => r.id !== reviewToDelete.id));
      setDeleteModal(false);
      setSuccessDeleteReviewModal(true);
    } catch (err) {
      console.log("Delete review error:", err);
      Alert.alert("Lỗi", "Không thể xóa đánh giá.");
    }
  };

  return (
    <PickView padding={SPACING.md}>
      <UniversalConfirmModal
        visible={deleteModal}
        title="Xóa đánh giá"
        message="Bạn có chắc chắn muốn xóa đánh giá này?"
        buttons={[
          { text: "Hủy", type: "cancel", onPress: () => setDeleteModal(false) },
          { text: "Xóa", type: "danger", onPress: confirmDelete },
        ]}
      />

      <UniversalConfirmModal
        visible={emptyTextNotificationModal}
        title="Thông báo"
        message="Vui lòng nhập nội dung bình luận."
        buttons={[
          { text: "OK", type: "primary", onPress: () => setEmptyTextNotificationModal(false) },
        ]}
      />

      <UniversalConfirmModal
        visible={successCreateReviewModal}
        title="Thành công"
        message="Đánh giá thành công."
        buttons={[
          { text: "OK", type: "primary", onPress: () => setSuccessCreateReviewModal(false) },
        ]}
      />

      <UniversalConfirmModal
        visible={successUpdateReviewModal}
        title="Thành công"
        message="Cập nhật đánh giá thành công."
        buttons={[
          {
            text: "OK",
            type: "primary",
            onPress: () => {
              setSuccessUpdateReviewModal(false);
              setEditModalVisible(false);
            },
          },
        ]}
      />

      <UniversalConfirmModal
        visible={successDeleteReviewModal}
        title="Thành công"
        message="Đã xóa đánh giá."
        buttons={[
          { text: "OK", type: "primary", onPress: () => setSuccessDeleteReviewModal(false) },
        ]}
      />
      <UniversalConfirmModal
        visible={errorReviewModal.visible}
        title="Thông báo"
        message={errorReviewModal.message}
        buttons={[
          {
            text: "OK",
            type: "primary",
            onPress: () => setErrorReviewModal({ visible: false, message: "" }),
          },
        ]}
      />

      <EditReviewModal
        visible={editModalVisible}
        rating={rating}
        setRating={setRating}
        comment={commentText}
        setComment={setCommentText}
        images={images}
        setImages={setImages}
        onPickImages={pickImages}
        onSubmit={handleUpdateReview}
        onClose={() => setEditModalVisible(false)}
      />

      <PickText font="bold" size={FONT_SIZE.xl} style={{ marginBottom: SPACING.sm }}>
        Đánh giá ({localReviews.length})
      </PickText>

      <PickView marginTop={SPACING.xs}>
        <PickText font="semibold">Đánh giá sao: {rating}/10</PickText>

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

        <TouchableOpacity
          onPress={pickImages}
          style={{
            backgroundColor: "#eef6ff",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
            alignSelf: "flex-start",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
            marginTop: -10,
          }}
        >
          <Icon name="image-plus" size={18} color={COLORS.primary} style={{ marginRight: 6 }} />
          <PickText style={{ color: COLORS.primary, fontWeight: "600" }}>Thêm ảnh</PickText>
        </TouchableOpacity>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {images.map((img, i) => (
            <PickView
              key={img.uri + i}
              style={{
                marginRight: SPACING.xs,
                position: "relative",
              }}
            >
              <Image
                source={{ uri: img.uri }}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: RADIUS.sm,
                  borderWidth: 1,
                  borderColor: "#ddd",
                }}
              />

              {!img.isRemote && (
                <TouchableOpacity
                  onPress={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: -6,
                    backgroundColor: "rgba(0, 0, 0, 0.65)",
                    padding: 3,
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Icon2 name="close" size={14} color="#fff" />
                </TouchableOpacity>
              )}
            </PickView>
          ))}
        </ScrollView>

        <PickButton
          title={editMode ? "Cập nhật đánh giá" : "Gửi đánh giá"}
          type="Primary"
          onPress={editMode ? handleUpdateReview : handleSubmit}
          style={{ marginTop: SPACING.sm }}
        />
      </PickView>

      {sortedReviews.slice(0, visibleReviews).map((r) => (
        <PickView
          key={r.id}
          padding={SPACING.sm}
          style={{
            marginTop: SPACING.md,
            borderRadius: 8,
            backgroundColor: COLORS.surface,
          }}
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
            <PickView style={{ flex: 1 }}>
              <PickText font="semibold">{r.user.name}</PickText>

              <PickText size={FONT_SIZE.sm} style={{ color: COLORS.text.secondary, marginTop: 2 }}>
                {formatRelativeTime(r.updatedAt)}
              </PickText>
            </PickView>

            <PickText>⭐ {r.rating}</PickText>
          </PickView>

          <PickText>{r.comment}</PickText>

          {r.images && r.images.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
              {r.images.map((img, idx) => (
                <Image
                  key={img + idx}
                  source={{ uri: img }}
                  style={{
                    width: 80,
                    height: 80,
                    marginRight: SPACING.xs,
                    borderRadius: RADIUS.sm,
                  }}
                />
              ))}
            </ScrollView>
          )}

          {String(r.user.id) === String(currentUserId) && (
            <PickView
              row
              gap={SPACING.sm}
              marginTop={SPACING.sm}
              style={{ justifyContent: "flex-end" }}
            >
              <TouchableOpacity
                onPress={() => startEdit(r)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "rgba(34,197,94,0.12)",
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                }}
              >
                <Icon name="pencil" size={16} color="#22c55e" />
                <PickText style={{ color: "#22c55e", fontWeight: "600", marginLeft: 4 }}>
                  Sửa
                </PickText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setReviewToDelete(r);
                  setDeleteModal(true);
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "rgba(239,68,68,0.12)",
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                }}
              >
                <Icon name="trash-can-outline" size={16} color="#ef4444" />
                <PickText style={{ color: "#ef4444", fontWeight: "600", marginLeft: 4 }}>
                  Xóa
                </PickText>
              </TouchableOpacity>
            </PickView>
          )}
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
              marginTop: 16,
            }}
          />
        </PickView>
      )}
    </PickView>
  );
};

export default MovieReviews;
