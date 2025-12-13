import React, { useEffect } from "react";
import { Image, TouchableOpacity, StyleSheet } from "react-native";
import { PickView, PickText } from "@Components";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS, FONT_SIZE, SPACING } from "@Constants/theme";
import { formatCurrency } from "@Utils/currencyUtils";
import { useAdditionalServicePrice } from "@Hooks/additionalService/useAdditionalService";
import { useBookingStore } from "@Store/useBookingStore";
import { useTranslation } from "@Hooks/useTranslation";

const AdditionalItem = ({ item, updateServiceQty }: any) => {
  const { price, isLoading } = useAdditionalServicePrice(item.id);
  const { updateServicePrice } = useBookingStore();
  const { t } = useTranslation();

  const displayPrice = price?.price ?? 0;

  useEffect(() => {
    if (price?.price && item.price !== price.price) {
      updateServicePrice(item.id, price.price, price.priceId);
    }
  }, [price]);

  return (
    <PickView style={styles.card}>
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} resizeMode="cover" />

      <PickView style={styles.cardContent}>
        <PickText style={styles.itemName}>{item.name}</PickText>
        {item.description && <PickText style={styles.itemDesc}>{item.description}</PickText>}
        <PickText style={styles.itemPrice}>
          {isLoading ? t("BOOKING_ADDITIONAL_ITEM_LOADING") : formatCurrency(displayPrice)}
        </PickText>
      </PickView>

      <PickView style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={() => updateServiceQty(item.id, Math.max(0, item.quantity - 1))}
        >
          <Ionicons name="remove-circle-outline" size={26} color={COLORS.accent} />
        </TouchableOpacity>

        <PickView style={styles.qtyBox}>
          <PickText style={styles.qtyText}>{item.quantity}</PickText>
        </PickView>

        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={() => updateServiceQty(item.id, item.quantity + 1)}
        >
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
    borderRadius: 10,
    padding: SPACING.md,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },

  thumbnail: {
    width: 70,
    height: 90,
    borderRadius: 10,
    backgroundColor: "#ecf0f1",
  },

  cardContent: { flex: 1, marginLeft: 12 },

  itemName: { fontSize: FONT_SIZE.md, fontWeight: "bold" },

  itemDesc: { fontSize: FONT_SIZE.sm, color: "#666", marginTop: 2 },

  itemPrice: { fontSize: FONT_SIZE.md, color: COLORS.accent, marginTop: 4, fontWeight: "600" },

  quantityContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  iconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },

  qtyBox: {
    minWidth: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#f0f0f0",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },

  qtyText: {
    fontWeight: "700",
    fontSize: FONT_SIZE.md,
    color: "#333",
  },
});

export default AdditionalItem;
