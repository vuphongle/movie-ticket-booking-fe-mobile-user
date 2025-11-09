import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { PickView, PickText } from "@Components";
import { SPACING, FONT_SIZE } from "@Constants/theme";

interface PaymentSectionProps {
  paymentMethod: "PAYOS" | "VNPAY" | null;
  setPaymentMethod: (method: "PAYOS" | "VNPAY") => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ paymentMethod, setPaymentMethod }) => {
  return (
    <PickView
      style={{
        marginTop: SPACING.md,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: SPACING.md,
        shadowColor: "#00000010",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <PickText
        style={{
          fontWeight: "bold",
          fontSize: FONT_SIZE.lg,
          marginBottom: SPACING.sm,
          color: "#012e6e",
        }}
      >
        Phương thức thanh toán
      </PickText>

      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: paymentMethod === "PAYOS" ? "#012e6e" : "#D1D1D1",
          borderRadius: 16,
          padding: SPACING.md,
          marginTop: SPACING.sm,
          gap: SPACING.sm,
          backgroundColor: paymentMethod === "PAYOS" ? "#E6EFF9" : "#FFFFFF",
        }}
        onPress={() => setPaymentMethod("PAYOS")}
      >
        <Image source={require("@Assets/images/payos-icon.png")} style={{ width: 32, height: 32 }} />
        <PickText style={{ fontWeight: "700" }}>Thanh toán bằng QR</PickText>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: paymentMethod === "VNPAY" ? "#012e6e" : "#D1D1D1",
          borderRadius: 16,
          padding: SPACING.md,
          marginTop: SPACING.sm,
          gap: SPACING.sm,
          backgroundColor: paymentMethod === "VNPAY" ? "#E6EFF9" : "#FFFFFF",
        }}
        onPress={() => setPaymentMethod("VNPAY")}
      >
        <Image source={require("@Assets/images/VNPAY-icon.png")} style={{ width: 32, height: 32 }} />
        <PickText style={{ fontWeight: "700" }}>Ví điện tử VNPAY</PickText>
      </TouchableOpacity>
    </PickView>
  );
};

export default PaymentSection;
