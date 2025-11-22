import React from "react";
import { Modal, ScrollView, TouchableOpacity, Image } from "react-native";
import { PickView, PickText, PickInput, PickButton } from "@Components";
import { COLORS, SPACING, RADIUS, FONT_SIZE } from "@Constants/theme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icon2 from "react-native-vector-icons/Ionicons";

interface LocalImage {
  uri: string;
  type: string;
  name: string;
  isRemote?: boolean;
}

interface EditReviewModalProps {
  visible: boolean;
  rating: number;
  setRating: (n: number) => void;
  comment: string;
  setComment: (t: string) => void;
  images: LocalImage[];
  setImages: (fn: any) => void;
  onPickImages: () => void;
  onClose: () => void;
  onSubmit: () => void;
}

const EditReviewModal: React.FC<EditReviewModalProps> = ({
  visible,
  rating,
  setRating,
  comment,
  setComment,
  images,
  setImages,
  onPickImages,
  onClose,
  onSubmit,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <PickView
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          justifyContent: "center",
          paddingHorizontal: 20,
        }}
      >
        <PickView
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: SPACING.md,
            maxHeight: "85%",
          }}
        >
          <PickText font="bold" size={FONT_SIZE.lg}>
            Sửa đánh giá
          </PickText>

          <PickView row style={{ flexWrap: "wrap", marginVertical: SPACING.sm }}>
            {Array.from({ length: 10 }, (_, i) => (
              <TouchableOpacity key={i} onPress={() => setRating(i + 1)}>
                <PickText size={24} style={{ color: i < rating ? "#facc15" : "#475569" }}>
                  ★
                </PickText>
              </TouchableOpacity>
            ))}
          </PickView>

          <PickInput value={comment} onChangeText={setComment} placeholder="Nhập bình luận..." />

          <TouchableOpacity
            onPress={onPickImages}
            style={{
              backgroundColor: "#eef6ff",
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
              marginTop: -10,
            }}
          >
            <Icon name="image-plus" size={18} color={COLORS.primary} />
            <PickText style={{ marginLeft: 6, color: COLORS.primary }}>Thêm ảnh</PickText>
          </TouchableOpacity>

          <ScrollView horizontal style={{ marginTop: 10 }} showsHorizontalScrollIndicator={false}>
            {images.map((img, idx) => (
              <PickView key={idx} style={{ marginRight: 8, position: "relative" }}>
                <Image
                  source={{ uri: img.uri }}
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: RADIUS.sm,
                  }}
                />

                <TouchableOpacity
                  onPress={() =>
                    setImages((prev: LocalImage[]) =>
                      prev.filter((_: LocalImage, i: number) => i !== idx)
                    )
                  }
                  style={{
                    position: "absolute",
                    top: -1,
                    right: -5,
                    backgroundColor: "rgba(0,0,0,0.65)",
                    padding: 3,
                    borderRadius: 20,
                  }}
                >
                  <Icon2 name="close" size={14} color="#fff" />
                </TouchableOpacity>
              </PickView>
            ))}
          </ScrollView>

          <PickView row justifySpaceBetween marginTop={SPACING.md}>
            <PickButton
              title="Đóng"
              type="Secondary"
              onPress={onClose}
              style={{ flex: 1, marginRight: 10 }}
            />

            <PickButton title="Lưu" type="Primary" onPress={onSubmit} style={{ flex: 1 }} />
          </PickView>
        </PickView>
      </PickView>
    </Modal>
  );
};

export default EditReviewModal;
