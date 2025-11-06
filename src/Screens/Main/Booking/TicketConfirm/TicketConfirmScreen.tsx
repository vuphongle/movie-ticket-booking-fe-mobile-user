import React from "react";
import { ScrollView } from "react-native";
import { PickView, PickText } from "@Components";
import { scale } from "@Theme/Scale";
import { COLORS } from "@Constants/theme";

const TicketConfirmScreen: React.FC = () => {
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
          🎟️ Xác Nhận Vé
        </PickText>

        <PickText
          variant="body_large"
          color="placeholder"
          align="center"
          style={{ marginBottom: scale(30) }}
        >
          Kiểm tra lại thông tin đặt vé của bạn trước khi hoàn tất.
        </PickText>

        <PickText
          variant="h5"
          font="semibold"
          color="heading-primary"
          style={{ marginBottom: scale(10) }}
        >
          Thông Tin Phim
        </PickText>

        <PickText
          variant="h5"
          font="semibold"
          color="heading-primary"
          style={{ marginTop: scale(20), marginBottom: scale(10) }}
        >
          Ghế & Suất Chiếu
        </PickText>

        <PickText
          variant="h5"
          font="semibold"
          color="heading-primary"
          style={{ marginTop: scale(20), marginBottom: scale(10) }}
        >
          Dịch Vụ Đi Kèm
        </PickText>
      </PickView>
    </ScrollView>
  );
};

export default TicketConfirmScreen;
