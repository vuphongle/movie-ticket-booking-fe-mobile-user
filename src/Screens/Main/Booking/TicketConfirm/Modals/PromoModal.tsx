import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, Image } from "react-native";
import { PickButton} from "@Components";
import { SPACING, FONT_SIZE } from "@Constants/theme";
import { formatCurrency } from "@Utils/currencyUtils";

interface PromoModalProps {
  visible: boolean;
  promoPreview: any;
  selectedPromo: any;
  setSelectedPromo: React.Dispatch<React.SetStateAction<any>>;
  setPromoDiscount: React.Dispatch<React.SetStateAction<number>>;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

interface DetailType {
  detailId: string;
  reason: string;
  lineDiscount?: number;
  giftServiceId?: string;
}

interface GiftType {
  serviceId: string;
  thumbnail: string;
  serviceName: string;
  quantity: number;
}

const PromoModal: React.FC<PromoModalProps> = ({
  visible,
  promoPreview,
  selectedPromo,
  setSelectedPromo,
  setPromoDiscount,
  setVisible,
}) => {
  if (!visible || !promoPreview) return null;

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: SPACING.md,
      }}
    >
      <View
        style={{
          backgroundColor: "#FFF",
          borderRadius: 16,
          padding: SPACING.md,
          width: "90%",
          maxHeight: "80%",
        }}
      >
        <Text
          style={{
            fontSize: FONT_SIZE.lg,
            fontWeight: "700",
            color: "#012e6e",
            marginBottom: SPACING.sm,
            textAlign: "center",
          }}
        >
          Chọn khuyến mại
        </Text>

        <ScrollView
          style={{ marginBottom: SPACING.md, maxHeight: 250 }}
          showsVerticalScrollIndicator={false}
        >
          {promoPreview.detailResults
             .sort((a: DetailType, b: DetailType) => (b.lineDiscount || 0) - (a.lineDiscount || 0))
             .map((detail: DetailType, index: number) => {
              const gift = promoPreview.gifts?.find((g: GiftType) => g.serviceId === detail.giftServiceId);
              const isSelected = selectedPromo?.detailId === detail.detailId;

              return (
                <TouchableOpacity
                  key={detail.detailId}
                  onPress={() => setSelectedPromo(detail)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: isSelected ? 2 : 1,
                    borderColor: isSelected ? "#FF8C42" : "#DDD",
                    borderRadius: 12,
                    padding: SPACING.sm,
                    marginBottom: SPACING.sm,
                    backgroundColor: isSelected ? "#FFD6A5" : "#FFF8F0",
                    position: "relative",
                  }}
                >
                  {index === 0 && (
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        backgroundColor: "#FF6D00",
                        borderRadius: 2,
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        zIndex: 10,
                      }}
                    >
                      <Text style={{ color: "#FFF", fontSize: 10 }}>Lựa chọn Tốt nhất</Text>
                    </View>
                  )}

                  <Image
                    source={{ uri: "https://cdn-icons-png.flaticon.com/512/888/888879.png" }}
                    style={{ width: 50, height: 50, borderRadius: 8, marginRight: 12 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "600", color: "#012e6e" }}>
                      {detail.reason.replace("thành công", "").trim()}
                    </Text>

                    {gift ? (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: isSelected ? "#FF8C42" : "#FFE0B2",
                          borderWidth: 1,
                          borderColor: isSelected ? "#FF8C42" : "#FFB74D",
                          borderRadius: 8,
                          padding: 4,
                          marginTop: 4,
                          maxWidth: 180,
                        }}
                      >
                        <Image
                          source={{ uri: gift.thumbnail }}
                          style={{ width: 36, height: 36, borderRadius: 6, marginRight: 6 }}
                        />
                        <Text
                          style={{
                            fontSize: FONT_SIZE.sm,
                            fontWeight: "600",
                            color: isSelected ? "#FFF" : "#FF6D00",
                            flexShrink: 1,
                          }}
                          numberOfLines={2}
                          ellipsizeMode="tail"
                        >
                          {gift.serviceName} x{gift.quantity}
                        </Text>
                      </View>
                    ) : (
                      <Text style={{ color: "#555", marginTop: 4 }}>
                        Giảm: {formatCurrency(detail.lineDiscount || 0)}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
        </ScrollView>

        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
          <PickButton
            title="Áp dụng"
            type="Primary"
            onPress={() => {
              if (!selectedPromo) {
                Alert.alert("Chọn khuyến mại", "Vui lòng chọn một khuyến mại.");
                return;
              }
              setPromoDiscount(selectedPromo.lineDiscount || 0);
              setVisible(false);
            }}
            style={{ flex: 1, backgroundColor: "#FF8C42" }}
          />
        </View>
      </View>
    </View>
  );
};

export default PromoModal;
