import React, { useState } from "react";
import { ScrollView, Image, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { PickView, PickText, PickButton, ScreenHeader } from "@Components";
import { COLORS, FONT_SIZE, SPACING } from "@Constants/theme";
import { formatCurrency } from "@Utils/currencyUtils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';

interface ServiceItem {
  id: number;
  name: string;
  price: number;
  thumbnail: string;
  quantity: number;
  category: string;
}

const AdditionalServiceScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [services, setServices] = useState<ServiceItem[]>([
    {
      id: 1,
      name: "Combo Nhà Gấu",
      price: 249000,
      thumbnail: "https://example.com/combo1.png",
      quantity: 1,
      category: "COMBO 2 NGĂN",
    },
    {
      id: 2,
      name: "Combo Có Gấu",
      price: 119000,
      thumbnail: "https://example.com/combo2.png",
      quantity: 1,
      category: "COMBO 2 NGĂN",
    },
    {
      id: 3,
      name: "Combo Gấu",
      price: 109000,
      thumbnail: "https://example.com/combo3.png",
      quantity: 8,
      category: "COMBO 2 NGĂN",
    },
    {
      id: 4,
      name: "BẮP PHÔ MAI 60OZ",
      price: 60000,
      thumbnail: "https://example.com/popcorn.png",
      quantity: 3,
      category: "BẮP RANG BƠ",
    },
  ]);

  const groupedServices = services.reduce<Record<string, ServiceItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const increaseQty = (id: number) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, quantity: s.quantity + 1 } : s))
    );
  };

  const decreaseQty = (id: number) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id && s.quantity > 0 ? { ...s, quantity: s.quantity - 1 } : s
      )
    );
  };

  const selectedItems = services.filter((s) => s.quantity > 0);
  const total = selectedItems.reduce((sum, s) => sum + s.price * s.quantity, 0);

  return (
    <PickView style={styles.container}>
      <ScreenHeader title="Combo" backgroundColor={COLORS.background["bg-brand-quaternary"]} />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        {Object.entries(groupedServices).map(([category, items]) => (
          <PickView key={category} style={styles.categoryContainer}>
            <PickView style={styles.categoryHeader}>
              <PickText style={styles.categoryTitle}>{category}</PickText>
              <Ionicons name="chevron-down" size={18} color="white" />
            </PickView>

            {items.map((item) => (
              <PickView key={item.id} style={styles.card}>
                <Image
                  source={{ uri: item.thumbnail }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
                <PickView style={styles.cardContent}>
                  <PickText style={styles.itemName}>{item.name}</PickText>
                  <PickText style={styles.itemPrice}>{formatCurrency(item.price)}</PickText>
                </PickView>

                <PickView style={styles.quantityControl}>
                  <TouchableOpacity onPress={() => increaseQty(item.id)}>
                    <Ionicons name="add-circle-outline" size={26} color={COLORS.accent} />
                  </TouchableOpacity>
                  <PickText style={styles.qtyText}>{item.quantity}</PickText>
                  <TouchableOpacity onPress={() => decreaseQty(item.id)}>
                    <Ionicons name="remove-circle-outline" size={26} color={COLORS.accent} />
                  </TouchableOpacity>
                </PickView>
              </PickView>
            ))}
          </PickView>
        ))}
      </ScrollView>

      <PickView style={[styles.summary, { paddingBottom: insets.bottom }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {selectedItems.map((item) => (
            <PickView key={item.id} style={styles.selectedItem}>
              <Image source={{ uri: item.thumbnail }} style={styles.selectedThumb} />
              <PickText style={styles.selectedText}>
                {item.quantity}x {item.name.split(" ")[0]}
              </PickText>
              <TouchableOpacity
                onPress={() => setServices((prev) => prev.map((s) => (s.id === item.id ? { ...s, quantity: 0 } : s)))}
              >
                <Ionicons name="close-circle" size={20} color="#555" />
              </TouchableOpacity>
            </PickView>
          ))}
        </ScrollView>

        <PickView style={styles.bottomSummary}>
          <PickText style={styles.bottomSeat}>1 Ghế: J15</PickText>
          <PickText style={styles.bottomTotal}>Tổng cộng: {formatCurrency(total)}</PickText>
          <PickButton
            title=""
            iconRight={<Ionicons name="arrow-forward" size={22} color="white" />}
            type="Primary"
            style={styles.nextButton}
          />
        </PickView>
      </PickView>
    </PickView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  categoryContainer: { marginBottom: 12 },
  categoryHeader: {
    backgroundColor: "#4B0082",
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryTitle: {
    color: "#FFD700",
    fontWeight: "700",
    fontSize: FONT_SIZE.md,
    textTransform: "uppercase",
  },
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
  thumbnail: { width: 60, height: 80, borderRadius: 8 },
  cardContent: { flex: 1, marginLeft: 12 },
  itemName: { fontSize: FONT_SIZE.md, fontWeight: "600" },
  itemPrice: { fontSize: FONT_SIZE.md, color: COLORS.accent, marginTop: 4 },
  quantityControl: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  qtyText: { fontWeight: "600", fontSize: FONT_SIZE.md },
  summary: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingVertical: SPACING.sm,
  },
  selectedItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 6,
    borderRadius: 20,
    gap: 4,
  },
  selectedThumb: { width: 28, height: 28, borderRadius: 6 },
  selectedText: { fontSize: FONT_SIZE.sm, fontWeight: "600" },
  bottomSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  bottomSeat: { fontWeight: "600", fontSize: FONT_SIZE.md },
  bottomTotal: { fontWeight: "700", fontSize: FONT_SIZE.md, color: COLORS.accent },
  nextButton: {
    width: 46,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AdditionalServiceScreen;
