import React from "react";
import { Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { PickView, PickText } from "@Components";
import { COLORS, SPACING, RADIUS, FONT_SIZE } from "@Constants/theme";

export enum MovieAge {
  P = 'P',
  K = 'K',
  T13 = 'T13',
  T16 = 'T16',
  T18 = 'T18',
  C = 'C',
}


interface MovieCardProps {
  title: string;
  genre: string;
  age: MovieAge;
  graphics: string[],
  rating: number;
  duration: string;
  imageUrl?: string;
  onPress?: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  title,
  genre,
  rating,
  age,
  graphics,
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
        <PickView style={styles.ageBadge}>
          <PickText style={styles.ageText}>{age}</PickText>
        </PickView>
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
    marginBottom: SPACING.md,
    width: 150,
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
  ageBadge: {
    position: "absolute",
    top: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: "red",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  ageText: {
    color: COLORS.text.white,
    fontSize: FONT_SIZE.xs,
    fontWeight: "600",
  },
});

export default MovieCard;
