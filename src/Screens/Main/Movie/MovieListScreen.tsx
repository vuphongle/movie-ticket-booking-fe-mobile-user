import React from "react";
import { ActivityIndicator, TouchableOpacity, FlatList, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { PickView, PickText } from "@Components";
import { useMovieList } from "@Hooks/useMovieList";
import { COLORS, SPACING, RADIUS, FONT_SIZE } from "@Constants/theme";
import { ScreenHeader } from "@Components";
import { formatGraphicLabel } from "@Utils/graphicUtils";
import useThemedStyles from "@Theme/Hook/useThemedStyles";

const MovieListScreen = ({ route }: any) => {
  const { type, title, emptyText } = route.params;
  const navigation = useNavigation();
  const { movies, isLoading, error } = useMovieList({ type });
  const { colors, spacing, radius } = useThemedStyles();

  if (isLoading)
    return (
      <PickView flex={1} justifyCenter alignCenter backgroundColor={COLORS.primary}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <PickText size={16} style={{ color: "#fff", marginTop: SPACING.md }}>
          Đang tải {title.toLowerCase()}...
        </PickText>
      </PickView>
    );

  if (error)
    return (
      <PickView flex={1} justifyCenter alignCenter backgroundColor={COLORS.primary}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: SPACING.sm }}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <PickText size={16} style={{ color: "#fff", marginBottom: SPACING.sm }}>
          Có lỗi xảy ra khi tải {title.toLowerCase()}
        </PickText>
      </PickView>
    );

  const renderMovieItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate("MovieDetail", { id: item.id })}
    >
      <PickView style={styles.imageContainer}>
        {item.poster ? (
          <Image source={{ uri: item.poster }} style={styles.image} />
        ) : (
          <PickView style={styles.placeholderImage} justifyCenter alignCenter>
            <PickText style={styles.placeholderText}>🎬</PickText>
          </PickView>
        )}
        {item.age && (
          <PickView style={styles.ageBadge}>
            <PickText style={styles.ageText}>{item.age}</PickText>
          </PickView>
        )}
        {item.rating != null && (
          <PickView style={styles.ratingBadge}>
            <PickText style={styles.ratingText}>⭐ {String(item.rating)}</PickText>
          </PickView>
        )}
      </PickView>

      <PickView style={styles.contentContainer}>
        <PickText style={styles.title} numberOfLines={2}>
          {item.name}
        </PickText>
        <PickText style={styles.genre}>{item.genres?.map((g: any) => g.name).join(", ")}</PickText>
        <PickText style={styles.duration}>
          🕐 {String(item.duration || "")} - {String(formatGraphicLabel(item.graphics || ""))}
        </PickText>
      </PickView>
    </TouchableOpacity>
  );

  return (
    <PickView flex={1} backgroundColor={COLORS.primary}>
      <ScreenHeader
        title={title || ""}
        backgroundColor={colors.background["bg-brand-quaternary"]}
      />

      {movies && movies.length > 0 ? (
        <FlatList
          data={movies ?? []}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{
            paddingHorizontal: SPACING.lg,
            paddingVertical: SPACING.md,
          }}
          renderItem={renderMovieItem}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <PickText size={16} style={styles.emptyText}>
          {emptyText}
        </PickText>
      )}
    </PickView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    position: "relative",
    height: 216,
    borderTopLeftRadius: RADIUS.md,
    borderTopRightRadius: RADIUS.md,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.border,
  },
  placeholderText: {
    fontSize: 40,
  },
  ratingBadge: {
    position: "absolute",
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  ratingText: {
    color: COLORS.text.white,
    fontSize: FONT_SIZE.xs,
    fontWeight: "600",
  },
  contentContainer: {
    padding: SPACING.md,
  },
  title: {
    color: COLORS.text.primary,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    marginBottom: SPACING.xs,
    lineHeight: 20,
  },
  genre: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.xs,
  },
  duration: {
    color: COLORS.text.light,
    fontSize: FONT_SIZE.sm,
  },
  ageBadge: {
    position: "absolute",
    top: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: "red",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: RADIUS.sm,
  },
  ageText: {
    color: COLORS.text.white,
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
  },
  emptyText: {
    color: "#fff",
    textAlign: "center",
    marginTop: SPACING.xl,
    fontStyle: "italic",
    opacity: 0.8,
  },
});

export default MovieListScreen;
