import React from "react";
import { ScrollView } from "react-native";
import { PickView, PickText } from "@Components";
import { scale } from "@Theme/Scale";
import { COLORS } from "@Constants/theme";

const AdditionalServiceScreen: React.FC = () => {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: (COLORS.background as any)["bg-primary"] }}
      showsVerticalScrollIndicator={false}
    >
      <PickView style={{ padding: scale(20) }}>
        <PickText
          variant="h4"
          font="bold"
          color="heading-primary"
          align="center"
          style={{ marginBottom: scale(10) }}
        >
          🍿 Dịch Vụ Đi Kèm
        </PickText>

        <PickText
          variant="body_large"
          color="placeholder"
          align="center"
          style={{ marginBottom: scale(30) }}
        >
          Chọn thêm bắp, nước và các combo ưu đãi để trải nghiệm xem phim trọn vẹn hơn.
        </PickText>

        <PickText
          variant="h5"
          font="semibold"
          color="heading-primary"
          style={{ marginBottom: scale(10) }}
        >
          Combo Ưu Đãi
        </PickText>

        <PickText
          variant="h5"
          font="semibold"
          color="heading-primary"
          style={{ marginTop: scale(20), marginBottom: scale(10) }}
        >
          Thức Ăn & Nước Uống
        </PickText>
      </PickView>
    </ScrollView>
  );
};

export default AdditionalServiceScreen;
