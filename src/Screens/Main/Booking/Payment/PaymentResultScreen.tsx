import React from "react";
import { ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { PickView, PickText } from "@Components";
import useThemedStyles from "@Theme/Hook/useThemedStyles";

const PaymentResultScreen: React.FC = () => {
  const { colors } = useThemedStyles();

  const paymentStatus = "success";

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: colors.background["bg-brand-quaternary"] }}
    >
      <PickView alignCenter justifyCenter style={{ padding: 24, flex: 1 }}>
        {/* Tiêu đề */}
        <PickText
          variant="h3"
          font="bold"
          color="heading-primary"
          align="center"
          style={{ marginBottom: 10 }}
        >
          💳 Kết Quả Thanh Toán
        </PickText>

        {paymentStatus === "success" ? (
          <>
            <PickText
              variant="h4"
              font="semibold"
              color="sub-headline-brand"
              align="center"
              style={{ marginBottom: 8 }}
            >
              🎉 Thanh toán thành công!
            </PickText>
            <PickText variant="body_large" align="center" color="body" style={{ marginBottom: 24 }}>
              Cảm ơn bạn đã đặt vé. Kiểm tra thông tin vé trong mục “Vé của tôi”.
            </PickText>
          </>
        ) : (
          <>
            <PickText
              variant="h4"
              font="semibold"
              color="error-primary"
              align="center"
              style={{ marginBottom: 8 }}
            >
              ❌ Thanh toán thất bại
            </PickText>
            <PickText variant="body_large" align="center" color="body" style={{ marginBottom: 24 }}>
              Giao dịch không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
            </PickText>
          </>
        )}

        {/* Nút hành động */}
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                paymentStatus === "success"
                  ? colors.background["bg-brand-quaternary"]
                  : colors.background["bg-brand-tertiary"],
            },
          ]}
        >
          <PickText color="body-on-brand" font="semibold" align="center" variant="body_large">
            {paymentStatus === "success" ? "Về trang chủ" : "Thử lại"}
          </PickText>
        </TouchableOpacity>

        <PickView
          style={[styles.summaryBox, { backgroundColor: colors.background["bg-brand-quaternary"] }]}
        >
          <PickText
            variant="h5"
            font="semibold"
            color="heading-primary"
            style={{ marginBottom: 10 }}
          >
            Chi tiết giao dịch
          </PickText>

          <PickText variant="body_small" color="body">
            - Mã giao dịch: #ABC123456
          </PickText>
          <PickText variant="body_small" color="body">
            - Phim: Avengers: Endgame
          </PickText>
          <PickText variant="body_small" color="body">
            - Suất chiếu: 19:30 - 06/11/2025
          </PickText>
          <PickText variant="body_small" color="body">
            - Rạp: CGV Vincom Bà Triệu
          </PickText>
          <PickText variant="body_small" color="body">
            - Tổng tiền: 280.000đ
          </PickText>
        </PickView>
      </PickView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 200,
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 32,
  },
  summaryBox: {
    width: "100%",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});

export default PaymentResultScreen;
