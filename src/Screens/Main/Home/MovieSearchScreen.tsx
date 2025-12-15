import React, { useState } from "react";
import { TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator } from "react-native";
import { PickView, PickText } from "@Components";
import { COLORS, SPACING, FONT_SIZE, RADIUS } from "@Constants/theme";
import Icon from "react-native-vector-icons/Ionicons";
import { movieService } from "@Services/movie/movieService";
import { Movie } from "@Types/movieTypes";
import debounce from "lodash.debounce";
import { useNavigation } from "@react-navigation/native";
import useThemedStyles from "@Theme/Hook/useThemedStyles";
import { useTranslation } from "@Hooks/useTranslation";
import { getMovieTitle } from "@Utils";
import SearchByImageModal from "@Components/Modals/SearchByImageModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface MovieWithStatus extends Movie {
  status?: "SHOWING" | "COMING_SOON";
}

const MovieSearchScreen = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useThemedStyles();
  const navigation = useNavigation<any>();
  const [keyword, setKeyword] = useState("");
  const [movies, setMovies] = useState<MovieWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t, language } = useTranslation();

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const handleSearch = async (text: string) => {
    setKeyword(text);

    if (!text.trim()) {
      setMovies([]);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await movieService.searchMovies(text.trim());

      const showingNow = await movieService.getShowingNowMovies();
      const comingSoon = await movieService.getComingSoonMovies();

      const showingIds = new Set(showingNow.map((m) => m.id));
      const comingIds = new Set(comingSoon.map((m) => m.id));

      const processed: MovieWithStatus[] = searchResults.map((m) => ({
        ...m,
        status: showingIds.has(m.id) ? "SHOWING" : comingIds.has(m.id) ? "COMING_SOON" : undefined,
      }));

      setMovies(processed);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = debounce(handleSearch, 350);

  const renderTag = (movie: MovieWithStatus) => {
    if (movie.status === "SHOWING") {
      return (
        <PickView
          style={{
            backgroundColor: "#e7f9ea",
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 6,
            alignSelf: "flex-start",
          }}
        >
          <PickText
            style={{
              color: "#0a9000",
              fontWeight: "600",
              fontSize: FONT_SIZE.sm,
            }}
          >
            {t("HOME_SEARCH_TAG_SHOWING")}
          </PickText>
        </PickView>
      );
    }

    if (movie.status === "COMING_SOON") {
      return (
        <PickView
          style={{
            backgroundColor: "#fff4dd",
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 6,
            alignSelf: "flex-start",
          }}
        >
          <PickText
            style={{
              color: "#d88d00",
              fontWeight: "600",
              fontSize: FONT_SIZE.sm,
            }}
          >
            {t("HOME_SEARCH_TAG_COMING_SOON")}
          </PickText>
        </PickView>
      );
    }

    return null;
  };

  return (
    <PickView flex={1} backgroundColor={COLORS.background}>
      {/* Header Search */}
      <PickView
        row
        alignCenter
        justifySpaceBetween
        paddingHorizontal={SPACING.md}
        marginBottom={SPACING.md}
        backgroundColor="#012e6e"
        paddingTop={insets.top + 16}
        paddingBottom={12}
        shadowColor="#000"
        shadowOpacity={0.1}
        shadowRadius={4}
      >
        <PickView
          row
          alignCenter
          style={{
            flex: 1,
            backgroundColor: "white",
            paddingHorizontal: 14,
            borderRadius: 24,
          }}
        >
          <Icon name="search-outline" size={20} color="#555" />
          <TextInput
            value={keyword}
            onChangeText={debouncedSearch}
            placeholder={t("HOME_SEARCH_PLACEHOLDER")}
            placeholderTextColor="#999"
            style={{
              flex: 1,
              marginLeft: 8,
              fontSize: FONT_SIZE.md,
              color: COLORS.text.primary,
              paddingVertical: 8,
              lineHeight: 23,
            }}
          />
        </PickView>

        <TouchableOpacity
          onPress={() => setIsImageModalOpen(true)}
          style={{
            marginLeft: 10,
            width: 38,
            height: 38,
            borderRadius: 99,
            backgroundColor: "rgba(255,255,255,0.18)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="image-outline" size={20} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <PickText
            style={{
              color: "white",
              marginLeft: 12,
              fontSize: FONT_SIZE.lg,
              fontWeight: "bold",
            }}
          >
            {t("HOME_SEARCH_CANCEL")}
          </PickText>
        </TouchableOpacity>
      </PickView>

      {/* Loading */}
      {isLoading && (
        <PickView centerItems marginTop={40}>
          <ActivityIndicator size="large" color={colors.background["bg-brand-quaternary"]} />
        </PickView>
      )}

      {/* Empty state */}
      {!isLoading && keyword.length > 0 && movies.length === 0 && (
        <PickView centerItems marginTop={10} padding={SPACING.xl}>
          <Icon name="search-outline" size={70} color="#ccc" />

          <PickText style={{ marginTop: 20, fontSize: FONT_SIZE.lg, fontWeight: "700" }}>
            {t("HOME_SEARCH_EMPTY_TITLE")}
          </PickText>

          <PickText style={{ marginTop: 6, color: COLORS.text.secondary }}>
            {t("HOME_SEARCH_EMPTY_SUBTITLE")}
          </PickText>

          <TouchableOpacity
            onPress={() => setKeyword("")}
            style={{
              marginTop: 20,
              backgroundColor: COLORS.primary,
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: RADIUS.sm,
            }}
          >
            <PickText style={{ color: "white", fontWeight: "bold" }}>
              {t("HOME_SEARCH_EMPTY_ACTION")}
            </PickText>
          </TouchableOpacity>
        </PickView>
      )}

      {/* Results */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {movies.map((movie) => (
          <PickView
            key={movie.id}
            row
            padding={SPACING.md}
            gap={SPACING.md}
            style={{
              backgroundColor: COLORS.surface,
              marginHorizontal: SPACING.md,
              marginBottom: SPACING.sm,
              borderRadius: RADIUS.md,
            }}
          >
            <Image
              source={{ uri: movie.poster }}
              style={{
                width: 80,
                height: 110,
                borderRadius: RADIUS.md,
              }}
            />

            <PickView flex={1}>
              <PickText style={{ fontSize: 16, fontWeight: "700", marginBottom: 4 }}>
                {getMovieTitle(movie, language)}
              </PickText>

              <PickText style={{ color: "#999", marginBottom: 4 }}></PickText>

              {renderTag(movie)}
            </PickView>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("MovieDetail", {
                  id: movie.id,
                  slug: movie.slug,
                })
              }
              style={{
                backgroundColor: movie.status === "SHOWING" ? "#012e6e" : "#e5e5e5",
                paddingVertical: 4,
                paddingHorizontal: 16,
                borderRadius: 4,
                alignSelf: "center",
              }}
            >
              <PickText
                style={{
                  color: movie.status === "SHOWING" ? "white" : "#333",
                  fontWeight: "600",
                }}
              >
                {movie.status === "SHOWING"
                  ? t("HOME_SEARCH_BUTTON_BOOK")
                  : t("HOME_SEARCH_BUTTON_INFO")}
              </PickText>
            </TouchableOpacity>
          </PickView>
        ))}
      </ScrollView>

      <SearchByImageModal
        visible={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onSelectMovie={(movie) => {
          setIsImageModalOpen(false);
          navigation.navigate("MovieDetail", { id: movie.id, slug: movie.slug });
        }}
      />
    </PickView>
  );
};

export default MovieSearchScreen;
