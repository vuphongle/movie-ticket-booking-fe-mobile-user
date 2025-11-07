import React from "react";
import { ScrollView, Image, TouchableOpacity, StyleSheet } from "react-native";
import { PickView, PickText } from "@Components";
import { FONT_SIZE, SPACING } from "@Constants/theme";
import Ionicons from "react-native-vector-icons/Ionicons";

const SelectedServiceList = ({ selectedItems, updateServiceQty }: any) => {
  if (selectedItems.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.selectedContainer}
      contentContainerStyle={{ paddingHorizontal: SPACING.sm }}
    >
      {selectedItems.map((item: any) => (
        <PickView key={item.id} style={styles.selectedItem}>
          <Image source={{ uri: item.thumbnail }} style={styles.selectedThumb} />
          <PickText style={styles.selectedText}>
            {item.quantity}x {item.name.split(" ")[0]}
          </PickText>
          <TouchableOpacity onPress={() => updateServiceQty(item.id, 0)}>
            <Ionicons name="close-circle" size={20} color="#555" />
          </TouchableOpacity>
        </PickView>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  selectedContainer: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    backgroundColor: "#F9F9F9",
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 10,
  },
  selectedItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 6,
    borderRadius: 20,
    gap: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedThumb: { width: 28, height: 28, borderRadius: 6 },
  selectedText: { fontSize: FONT_SIZE.sm, fontWeight: "600" },
});

export default SelectedServiceList;
