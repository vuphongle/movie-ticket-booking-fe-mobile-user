import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PickView, PickText } from "@Components";
import { COLORS, SPACING, FONT_SIZE } from "@Constants/theme";

const Header = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + SPACING.md,
          paddingBottom: SPACING.xl,
        },
      ]}
    >
      <PickView row justifySpaceBetween alignCenter style={styles.headerRow}>
        <PickView style={styles.locationContainer}>
          <PickText style={styles.locationLabel}>📍 Địa điểm hiện tại</PickText>
          <PickText style={styles.locationText} numberOfLines={1}>
            TP. Hồ Chí Minh, Việt Nam
          </PickText>
        </PickView>
        <PickView row style={styles.iconContainer}>
          <Text style={styles.icon}>🔍</Text>
          <Text style={styles.icon}>🔔</Text>
        </PickView>
      </PickView>

      <PickView style={styles.titleContainer}>
        <PickText style={styles.welcomeText}>Chào mừng bạn đến với</PickText>
        <PickText style={styles.appTitle}>GO CINEMA</PickText>
        <PickText style={styles.subtitle}>Khám phá những bộ phim hay nhất</PickText>
      </PickView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    minHeight: 220,
  },
  headerRow: {
    marginBottom: SPACING.lg,
  },
  locationContainer: {
    flex: 1,
    marginRight: SPACING.md,
  },
  locationLabel: {
    color: COLORS.text.light,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.xs,
  },
  locationText: {
    color: COLORS.text.white,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },
  iconContainer: {
    gap: SPACING.md,
  },
  icon: {
    fontSize: 24,
    color: COLORS.text.white,
  },
  titleContainer: {
    alignItems: "center",
    marginTop: SPACING.lg,
  },
  welcomeText: {
    color: COLORS.text.light,
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.xs,
  },
  appTitle: {
    color: COLORS.text.white,
    fontSize: FONT_SIZE.xxxl,
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    color: COLORS.text.light,
    fontSize: FONT_SIZE.sm,
    textAlign: "center",
  },
});

export default Header;
