import React from "react";
import {
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Image,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { PickView, PickText } from "@Components";
import { useMovieList } from "@Hooks/useMovieList";
import { COLORS, SPACING } from "@Constants/theme";

const MovieListScreen = ({ route }: any) => {
  const { type, title, emptyText } = route.params;
  const navigation = useNavigation();
  const { movies, isLoading, error } = useMovieList({ type });

  if (isLoading)
    return (
      <PickView
        flex={1}
        justifyCenter
        alignCenter
        backgroundColor={COLORS.primary}
      >
        <ActivityIndicator size="large" color={COLORS.accent} />
        <PickText size={16} style={{ color: "#fff", marginTop: SPACING.md }}>
          Đang tải {title.toLowerCase()}...
        </PickText>
      </PickView>
    );

  if (error)
    return (
      <PickView
        flex={1}
        justifyCenter
        alignCenter
        backgroundColor={COLORS.primary}
      >
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: spacing.s8 }}>
            <Icon name="arrow-back" size={24} color={colors.text["heading-primary"]} />
          </TouchableOpacity>

        <PickText size={16} style={{ color: "#fff", marginBottom: SPACING.sm }}>
          Có lỗi xảy ra khi tải {title.toLowerCase()}
        </PickText>
      </PickView>
    );

  const renderMovieItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("MovieDetail", { id: item.id })}
    >
      <Image source={{ uri: item.poster }} style={styles.poster} />
      <PickText size={14} font="semibold" style={styles.movieTitle}>
        {item.name}
      </PickText>
      <PickText size={12} style={styles.movieGenre}>
        {item.genres.map((g: any) => g.name).join(", ")}
      </PickText>
    </TouchableOpacity>
  );

  // Giao diện chính
  return (
    <PickView flex={1} backgroundColor={COLORS.primary}>
      {/* Header */}
      <ImageBackground
        source={{
          uri:
            type === "nowShowing"
              ? "https://i.imgur.com/1tMFtOr.jpg"
              : "https://i.imgur.com/BKHyx6K.jpg",
        }}
        style={styles.headerBackground}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBack}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <PickText size={28} font="bold" style={styles.headerTitle}>
          {title}
        </PickText>
      </ImageBackground>

      {movies && movies.length > 0 ? (
        <FlatList
          data={movies}
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

const styles = {
  headerBackground: {
    width: "100%",
    height: 180,
    justifyContent: "flex-end" as const,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerBack: {
    position: "absolute" as const,
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 50,
  },
  headerTitle: {
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  card: {
    width: "48%",
//     backgroundColor: "#1E1E1E",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: SPACING.md,
  },
  poster: {
    width: "100%",
    height: 200,
    resizeMode: "cover" as const,
  },
  movieTitle: {
    color: "#fff",
    marginTop: 6,
    marginHorizontal: 8,
  },
  movieGenre: {
    color: "#bbb",
    marginHorizontal: 8,
    marginBottom: 8,
  },
  backButton: {
    position: "absolute" as const,
    top: 50,
    left: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 50,
  },
  emptyText: {
    color: "#fff",
    textAlign: "center" as const,
    marginTop: SPACING.xl,
    fontStyle: "italic" as const,
    opacity: 0.8,
  },
};

export default MovieListScreen;
