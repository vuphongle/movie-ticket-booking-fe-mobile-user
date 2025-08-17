import { memo } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export const LoadingOverlay = memo(({ visible }: { visible: boolean }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay} testID="loading-overlay">
      <ActivityIndicator size="large" color="#0000ff" testID="loading-indicator" />
    </View>
  );
});
