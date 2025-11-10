import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from "react-native";
import { PickView, PickText, PickButton } from "@Components";
import { SPACING, FONT_SIZE } from "@Constants/theme";
import { formatCurrency } from "@Utils/currencyUtils";

interface VoucherModalProps {
  visible: boolean;
  voucherPreview: any;
  selectedCoupon: any;
  selectedDetails: number[];
  setSelectedDetails: React.Dispatch<React.SetStateAction<number[]>>;
  setVoucherDiscount: React.Dispatch<React.SetStateAction<number>>;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

interface DetailType {
  detailId: number;
  reason: string;
  lineDiscount?: number;
  giftServiceId?: string;
  applied?: boolean;
}

interface GiftType {
  serviceId: string;
  thumbnail: string;
  serviceName: string;
  quantity: number;
}


const VoucherModal: React.FC<VoucherModalProps> = ({
  visible,
  voucherPreview,
  selectedCoupon,
  selectedDetails,
  setSelectedDetails,
  setVoucherDiscount,
  setVisible,
}) => {
  if (!visible || !voucherPreview) return null;

  return (
    <PickView style={styles.modalOverlay}>
      <PickView style={styles.modalContent}>
        <PickText style={styles.modalTitle}>🎟️ {selectedCoupon?.name}</PickText>
        <PickText style={styles.modalDescription}>{selectedCoupon?.description}</PickText>
        <PickText style={styles.modalDate}>
          Hiệu lực: {new Date(selectedCoupon?.startDate || 0).toLocaleDateString("vi-VN")} -{" "}
          {new Date(selectedCoupon?.endDate || 0).toLocaleDateString("vi-VN")}
        </PickText>

        <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
          {[
            ...voucherPreview.detailResults.filter((d: DetailType) =>
              d.reason.startsWith("Áp dụng thành công")
            ),
            ...voucherPreview.detailResults.filter(
              (d: DetailType) => !d.reason.startsWith("Áp dụng thành công")
            ),
          ].map((d: DetailType, index: number) => {
            const gift = voucherPreview.gifts.find((g: GiftType) => g.serviceId === d.giftServiceId);
            const isSelected = d.applied && selectedDetails.includes(d.detailId);
            const canSelect = d.applied;

            return (
              <TouchableOpacity
                key={d.detailId}
                style={[
                  styles.detailRow,
                  canSelect && { backgroundColor: "#E8F0FE", borderColor: "#4A90E2" },
                  isSelected && { backgroundColor: "#CFE2FF", borderColor: "#0057D8" },
                  !canSelect && { backgroundColor: "#EFEFEF", borderColor: "#D0D0D0" },
                ]}
                disabled={!canSelect}
                onPress={() => {
                  if (!canSelect) return;
                  setSelectedDetails((prev) =>
                    prev.includes(d.detailId)
                      ? prev.filter((id) => id !== d.detailId)
                      : [...prev, d.detailId]
                  );
                }}
              >
                <View style={styles.detailHeader}>
                  <View style={styles.checkboxContainer}>
                    <View
                      style={[
                        styles.checkbox,
                        isSelected && styles.checkboxChecked,
                        !canSelect && { opacity: 0.4 },
                      ]}
                    >
                      {isSelected && <Text style={styles.checkboxTick}>✓</Text>}
                    </View>
                    <PickText
                      style={[
                        styles.detailTitle,
                        canSelect && { color: "#0D47A1" },
                        !canSelect && { color: "#888" },
                      ]}
                    >
                      {selectedCoupon?.code}#{index + 1}
                    </PickText>
                  </View>

                  {gift ? (
                    <PickView style={styles.giftBox}>
                      <Image source={{ uri: gift.thumbnail }} style={styles.giftImage} />
                      <PickText style={styles.giftText}>
                        {gift.serviceName} x{gift.quantity}
                      </PickText>
                    </PickView>
                  ) : (
                    <PickText style={styles.discountText}>
                      Giảm {formatCurrency(d.lineDiscount)}
                    </PickText>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.modalButtons}>
          <PickButton
            title="Xác nhận"
            type="Primary"
            onPress={() => {
              const selectedDiscounts = voucherPreview.detailResults
                .filter((d: DetailType) => selectedDetails.includes(d.detailId))
                .reduce((sum: number, d: DetailType) => sum + (d.lineDiscount || 0), 0);
              setVoucherDiscount(selectedDiscounts);
              setVisible(false);
            }}
            style={{ flex: 1, marginLeft: SPACING.sm, maxWidth: 150, alignItems: "center" }}
          />
        </View>
      </PickView>
    </PickView>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.md,
    zIndex: 999,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: SPACING.md,
  },
  modalTitle: { fontSize: FONT_SIZE.lg, fontWeight: "700", marginBottom: SPACING.xs },
  modalDescription: { fontSize: FONT_SIZE.md, color: "#555", marginBottom: SPACING.xs },
  modalDate: { fontSize: FONT_SIZE.sm, color: "#888", marginBottom: SPACING.md },
  detailRow: {
    padding: SPACING.md,
    borderWidth: 1.2,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    marginBottom: 8,
  },
  detailHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  checkboxContainer: { flexDirection: "row", alignItems: "center" },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#4A90E2",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    backgroundColor: "#fff",
  },
  checkboxChecked: { backgroundColor: "#4A90E2" },
  checkboxTick: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  detailTitle: { fontWeight: "bold", fontSize: FONT_SIZE.sm },
  discountText: { fontSize: FONT_SIZE.sm, color: "#1A237E", fontWeight: "bold", marginTop: 4 },
  giftBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DFF5E1",
    borderWidth: 1,
    borderColor: "#4CAF50",
    padding: 6,
    borderRadius: 8,
    marginTop: 6,
    maxWidth: 175,
  },
  giftText: { fontSize: FONT_SIZE.sm, color: "#1B5E20", fontWeight: "600", flexShrink: 1 },
  modalButtons: { flexDirection: "row", marginTop: SPACING.md },
  giftImage: { width: 32, height: 32, borderRadius: 8, marginRight: 8 },
});

export default VoucherModal;
