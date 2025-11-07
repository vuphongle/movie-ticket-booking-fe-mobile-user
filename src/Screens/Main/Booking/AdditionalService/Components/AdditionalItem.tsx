import React, { useEffect } from "react";
import { Image, TouchableOpacity, StyleSheet } from "react-native";
import { PickView, PickText } from "@Components";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS, FONT_SIZE, SPACING } from "@Constants/theme";
import { formatCurrency } from "@Utils/currencyUtils";
import { useAdditionalServicePrice } from "@Hooks/additionalService/useAdditionalService";
import { useBookingStore } from "@Store/useBookingStore";

const AdditionalItem = ({ item, updateServiceQty }: any) => {
  const { price, isLoading } = useAdditionalServicePrice(item.id);
  const { updateServicePrice } = useBookingStore();

  const displayPrice = price?.price ?? 0;

  useEffect(() => {
    if (price?.price && item.price !== price.price) {
      updateServicePrice(item.id, price.price);
    }
  }, [price]);

  return (
    <PickView style={styles.card}>
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} resizeMode="cover" />
      <PickView style={styles.cardContent}>
        <PickText style={styles.itemName}>{item.name}</PickText>
        {item.description && <PickText style={styles.itemDesc}>{item.description}</PickText>}
        <PickText style={styles.itemPrice}>
          {isLoading ? "Đang tải..." : formatCurrency(displayPrice)}
        </PickText>
      </PickView>

      <PickView style={styles.quantityControl}>
        <TouchableOpacity onPress={() => updateServiceQty(item.id, Math.max(0, item.quantity - 1))}>
          <Ionicons name="remove-circle-outline" size={26} color={COLORS.accent} />
        </TouchableOpacity>
        <PickText style={styles.qtyText}>{item.quantity}</PickText>
        <TouchableOpacity onPress={() => updateServiceQty(item.id, item.quantity + 1)}>
          <Ionicons name="add-circle-outline" size={26} color={COLORS.accent} />
        </TouchableOpacity>
      </PickView>
    </PickView>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.sm,
    marginVertical: 6,
    borderRadius: 8,
    padding: SPACING.sm,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnail: { width: 60, height: 80, borderRadius: 8, backgroundColor: "#ecf0f1" },
  cardContent: { flex: 1, marginLeft: 12 },
  itemName: { fontSize: FONT_SIZE.md, fontWeight: "bold" },
  itemDesc: { fontSize: FONT_SIZE.sm, color: "#666", marginTop: 2 },
  itemPrice: { fontSize: FONT_SIZE.md, color: COLORS.accent, marginTop: 4 },
  quantityControl: { alignItems: "center", justifyContent: "center", gap: 4 },
  qtyText: { fontWeight: "600", fontSize: FONT_SIZE.md },
});

export default AdditionalItem;
