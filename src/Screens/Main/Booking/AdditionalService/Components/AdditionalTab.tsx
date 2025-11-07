import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { PickView, PickText } from "@Components";
import { COLORS, FONT_SIZE, SPACING } from "@Constants/theme";

interface Props {
  openTab: "COMBO" | "SINGLE";
  setOpenTab: (tab: "COMBO" | "SINGLE") => void;
}

const AdditionalTab: React.FC<Props> = ({ openTab, setOpenTab }) => (
  <PickView style={styles.container}>
    {["COMBO", "SINGLE"].map((tab) => (
      <TouchableOpacity key={tab} onPress={() => setOpenTab(tab as any)}>
        <PickText
          style={[styles.tabText, openTab === tab && { color: COLORS.accent, fontWeight: "700" }]}
        >
          {tab === "COMBO" ? "Combo" : "Sản phẩm lẻ"}
        </PickText>
      </TouchableOpacity>
    ))}
  </PickView>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  tabText: { fontSize: FONT_SIZE.md, color: "#999" },
});

export default AdditionalTab;
