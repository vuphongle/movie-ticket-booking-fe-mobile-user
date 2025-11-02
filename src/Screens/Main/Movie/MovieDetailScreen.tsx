import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MovieDetailScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Movie Detail Screen</Text>
      <Text style={styles.subtitle}>Thông tin chi tiết phim sẽ hiển thị tại đây.</Text>
    </View>
  );
};

export default MovieDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
  },
});
