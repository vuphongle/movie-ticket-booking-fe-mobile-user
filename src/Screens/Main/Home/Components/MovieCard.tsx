import React from "react";
import { Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { PickView, PickText } from "@Components";
import { COLORS, SPACING, RADIUS, FONT_SIZE } from "@Constants/theme";

interface MovieCardProps {
  title: string;
  genre: string;
  rating: number;
  duration: string;
  imageUrl?: string;
  onPress?: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  title,
  genre,
  rating,
  duration,
  imageUrl,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <PickView style={styles.imageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <PickView style={styles.placeholderImage} justifyCenter alignCenter>
            <Text style={styles.placeholderText}>🎬</Text>
          </PickView>
        )}
        <PickView style={styles.ratingBadge}>
          <PickText style={styles.ratingText}>⭐ {rating}</PickText>
        </PickView>
      </PickView>

      <PickView style={styles.contentContainer}>
        <PickText style={styles.title} numberOfLines={2}>
          {title}
        </PickText>
        <PickText style={styles.genre}>{genre}</PickText>
        <PickText style={styles.duration}>🕐 {duration}</PickText>
      </PickView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    marginRight: SPACING.md,
    width: 160,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    position: "relative",
    height: 200,
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
});

export default MovieCard;
