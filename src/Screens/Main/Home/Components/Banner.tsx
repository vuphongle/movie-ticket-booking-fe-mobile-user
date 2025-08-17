import React from "react";
import { StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { PickView, PickText } from "@Components";
import { COLORS, SPACING, RADIUS, FONT_SIZE } from "@Constants/theme";

interface BannerItem {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  backgroundColor?: string;
}

interface BannerProps {
  banners: BannerItem[];
}

const Banner: React.FC<BannerProps> = ({ banners }) => {
  return (
    <PickView style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        contentContainerStyle={styles.scrollContainer}
      >
        {banners.map((banner) => (
          <TouchableOpacity
            key={banner.id}
            style={[
              styles.bannerItem,
              { backgroundColor: banner.backgroundColor || COLORS.secondary },
            ]}
          >
            {banner.imageUrl ? (
              <Image source={{ uri: banner.imageUrl }} style={styles.bannerImage} />
            ) : (
              <PickView style={styles.bannerContent} justifyCenter alignCenter>
                <PickText style={styles.bannerTitle}>{banner.title}</PickText>
                {banner.subtitle && (
                  <PickText style={styles.bannerSubtitle}>{banner.subtitle}</PickText>
                )}
              </PickView>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </PickView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.xl,
  },
  scrollContainer: {
    paddingHorizontal: SPACING.md,
  },
  bannerItem: {
    width: 300,
    height: 150,
    borderRadius: RADIUS.lg,
    marginRight: SPACING.md,
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bannerContent: {
    flex: 1,
    padding: SPACING.lg,
  },
  bannerTitle: {
    color: COLORS.text.white,
    fontSize: FONT_SIZE.xl,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  bannerSubtitle: {
    color: COLORS.text.white,
    fontSize: FONT_SIZE.md,
    textAlign: "center",
    opacity: 0.9,
  },
});

export default Banner;
