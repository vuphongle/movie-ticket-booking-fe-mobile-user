import React, { useState, useEffect } from "react";
import { ScrollView, Image, StyleSheet, TouchableOpacity } from "react-native";
import { PickView, PickText, PickButton, ScreenHeader } from "@Components";
import { COLORS, FONT_SIZE, SPACING } from "@Constants/theme";
import { formatCurrency } from "@Utils/currencyUtils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAdditionalServices } from "@Hooks/additionalService/useAdditionalService";
import useThemedStyles from "@Theme/Hook/useThemedStyles";

interface ServiceItem {
  id: number;
  name: string;
  price: number;
  thumbnail: string;
  quantity: number;
  type: "COMBO" | "SINGLE";
  description?: string;
}

const AdditionalServiceScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { services: fetchedServices, isLoading } = useAdditionalServices();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [openTab, setOpenTab] = useState<"COMBO" | "SINGLE">("COMBO");
  const { colors } = useThemedStyles();

  // Sync fetched services into local state with quantity and price
  useEffect(() => {
    if (fetchedServices.length > 0) {
      const mapped: ServiceItem[] = fetchedServices.map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        thumbnail: s.thumbnail,
        type: s.type as "COMBO" | "SINGLE",
        quantity: 0,
        price: 0,
      }));
      setServices(mapped);
    }
  }, [fetchedServices]);

  const increaseQty = (id: number) => {
    setServices(prev =>
      prev.map(s => s.id === id ? { ...s, quantity: s.quantity + 1 } : s)
    );
  };

  const decreaseQty = (id: number) => {
    setServices(prev =>
      prev.map(s => s.id === id && s.quantity > 0 ? { ...s, quantity: s.quantity - 1 } : s)
    );
  };

  const selectedItems = services.filter(s => s.quantity > 0);
  const total = selectedItems.reduce((sum, s) => sum + s.price * s.quantity, 0);
  const filteredServices = services.filter(s => s.type === openTab);

  return (
    <PickView style={styles.container}>
      <ScreenHeader
        title="Dịch vụ bổ sung"
        backgroundColor={colors.background["bg-brand-quaternary"]}
      />

      {/* Tab chọn loại */}
      <PickView style={styles.tabContainer}>
        {["COMBO", "SINGLE"].map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setOpenTab(tab as "COMBO" | "SINGLE")}
          >
            <PickText
              style={[
                styles.tabText,
                openTab === tab && { color: COLORS.accent, fontWeight: "700" },
              ]}
            >
              {tab === "COMBO" ? "Combo" : "Sản phẩm lẻ"}
            </PickText>
          </TouchableOpacity>
        ))}
      </PickView>

      {isLoading ? (
        <PickView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <PickText>Loading...</PickText>
        </PickView>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        >
          {filteredServices.map(item => (
            <PickView key={item.id} style={styles.card}>
              <Image
                source={{ uri: item.thumbnail }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
              <PickView style={styles.cardContent}>
                <PickText style={styles.itemName}>{item.name}</PickText>
                {item.description && (
                  <PickText style={styles.itemDesc}>{item.description}</PickText>
                )}
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
        </ScrollView>
      )}

      {/* Summary bottom */}
      <PickView style={[styles.summary, { paddingBottom: insets.bottom }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {selectedItems.map(item => (
            <PickView key={item.id} style={styles.selectedItem}>
              <Image source={{ uri: item.thumbnail }} style={styles.selectedThumb} />
              <PickText style={styles.selectedText}>
                {item.quantity}x {item.name.split(" ")[0]}
              </PickText>
              <TouchableOpacity
                onPress={() =>
                  setServices(prev =>
                    prev.map(s => (s.id === item.id ? { ...s, quantity: 0 } : s))
                  )
                }
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
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  tabText: { fontSize: FONT_SIZE.md, color: "#999" },
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
  itemName: { fontSize: FONT_SIZE.md, fontWeight: "600" },
  itemDesc: { fontSize: FONT_SIZE.sm, color: "#666", marginTop: 2 },
  itemPrice: { fontSize: FONT_SIZE.md, color: COLORS.accent, marginTop: 4 },
  quantityControl: { alignItems: "center", justifyContent: "center", gap: 4 },
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
  nextButton: { width: 46, height: 40, borderRadius: 8, alignItems: "center", justifyContent: "center" },
});

export default AdditionalServiceScreen;
