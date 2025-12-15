import React, { useCallback, useEffect, useMemo, useState } from "react";
import { TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator } from "react-native";
import { PickView, PickText } from "@Components";
import { COLORS, SPACING, FONT_SIZE, RADIUS } from "@Constants/theme";
import Icon from "react-native-vector-icons/Ionicons";
import { movieService } from "@Services/movie/movieService";
import { SearchMovieResult } from "@Types/movieTypes";
import { useNavigation } from "@react-navigation/native";
import useThemedStyles from "@Theme/Hook/useThemedStyles";
import { useTranslation } from "@Hooks/useTranslation";
import { getMovieTitle } from "@Utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { launchImageLibrary } from "react-native-image-picker";
import debounce from "lodash.debounce";

interface MovieWithStatus extends SearchMovieResult {
  status?: "SHOWING" | "COMING_SOON";
}

const MovieSearchScreen = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useThemedStyles();
  const navigation = useNavigation<any>();
  const [keyword, setKeyword] = useState("");
  const [movies, setMovies] = useState<MovieWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [statusSets, setStatusSets] = useState<{ showing: Set<number>; coming: Set<number> }>();
  const { t, language } = useTranslation();
  const loadStatusSets = useCallback(async () => {
    if (statusSets) return statusSets;

    const [showingNow, comingSoon] = await Promise.all([
      movieService.getShowingNowMovies(),
      movieService.getComingSoonMovies(),
    ]);

    const value = {
      showing: new Set(showingNow.map((m) => m.id)),
      coming: new Set(comingSoon.map((m) => m.id)),
    };

    setStatusSets(value);
    return value;
  }, [statusSets]);

  useEffect(() => {
    loadStatusSets().catch(() => null);
  }, [loadStatusSets]);

  const withStatus = useCallback(
    (list: SearchMovieResult[]): MovieWithStatus[] => {
      const current = statusSets;
      if (!current) return list;

      return list.map((m) => ({
        ...m,
        status: current.showing.has(m.id)
          ? "SHOWING"
          : current.coming.has(m.id)
          ? "COMING_SOON"
          : undefined,
      }));
    },
    [statusSets]
  );

  const handleSearch = useCallback(
    async (text: string) => {
      const trimmed = text.trim();

      setKeyword(text);

      if (!trimmed) {
        setMovies([]);
        setHasSearched(false);
        return;
      }

      setIsLoading(true);
      setHasSearched(true);

      try {
        const sets = statusSets ?? (await loadStatusSets());
        const searchResults = await movieService.searchMovies(trimmed);
        const processed = sets ? withStatus(searchResults) : searchResults;
        setMovies(processed);
      } catch (err) {
        if (__DEV__) console.error("Search error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [loadStatusSets, statusSets, withStatus]
  );

  const handleSubmitSearch = useCallback(() => {
    handleSearch(keyword);
  }, [handleSearch, keyword]);

  const debouncedSearch = useMemo(
    () =>
      debounce((text: string) => {
        handleSearch(text);
      }, 350),
    [handleSearch]
  );

  const handleClear = useCallback(() => {
    setKeyword("");
    setMovies([]);
    setHasSearched(false);
    debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleImageSearch = useCallback(async () => {
    const res = await launchImageLibrary({ mediaType: "photo", quality: 0.9, selectionLimit: 1 });

    if (res.didCancel || !res.assets?.length) return;
    const picked = res.assets[0];
    if (!picked?.uri) return;

    setIsLoading(true);
    setHasSearched(true);

    try {
      const sets = statusSets ?? (await loadStatusSets());
      const list = await movieService.searchByImage({
        uri: picked.uri,
        type: picked.type ?? "image/jpeg",
        fileName: picked.fileName ?? "image-search.jpg",
      });

      const processed = Array.isArray(list) ? (sets ? withStatus(list) : list) : [];
      setMovies(processed);
    } catch (err) {
      if (__DEV__) console.error("Image search error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [loadStatusSets, statusSets, withStatus]);

  const showEmptyState = useMemo(
    () => !isLoading && hasSearched && keyword.trim().length > 0 && movies.length === 0,
    [hasSearched, isLoading, keyword, movies.length]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

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
        paddingTop={insets.top + 12}
        paddingBottom={12}
        shadowColor="#000"
        shadowOpacity={0.1}
        shadowRadius={4}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={8}
          style={{
            width: 38,
            height: 38,
            borderRadius: 99,
            backgroundColor: "rgba(255,255,255,0.18)",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 10,
          }}
        >
          <Icon name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <PickView
          row
          alignCenter
          style={{
            flex: 1,
            backgroundColor: "white",
            paddingHorizontal: 12,
            borderRadius: 22,
            height: 44,
          }}
        >
          <TouchableOpacity onPress={handleSubmitSearch} hitSlop={8}>
            <Icon name="search-outline" size={20} color="#555" />
          </TouchableOpacity>
          <TextInput
            value={keyword}
            onChangeText={(text) => {
              setKeyword(text);
              setHasSearched(false);
              debouncedSearch(text);
            }}
            placeholder={t("HOME_SEARCH_PLACEHOLDER")}
            placeholderTextColor="#999"
            returnKeyType="search"
            onSubmitEditing={handleSubmitSearch}
            style={{
              flex: 1,
              marginLeft: 8,
              fontSize: FONT_SIZE.md,
              color: COLORS.text.primary,
              paddingVertical: 0,
              lineHeight: 20,
            }}
          />

          {keyword.length > 0 && (
            <TouchableOpacity onPress={handleClear} hitSlop={8}>
              <Icon name="close-circle" size={18} color="#bbb" />
            </TouchableOpacity>
          )}
        </PickView>

        <TouchableOpacity
          onPress={handleImageSearch}
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
      </PickView>

      {/* Loading */}
      {isLoading && (
        <PickView centerItems marginTop={40}>
          <ActivityIndicator size="large" color={colors.background["bg-brand-quaternary"]} />
        </PickView>
      )}

      {/* Empty state */}
      {showEmptyState && (
        <PickView centerItems marginTop={10} padding={SPACING.xl}>
          <Icon name="search-outline" size={70} color="#ccc" />

          <PickText style={{ marginTop: 20, fontSize: FONT_SIZE.lg, fontWeight: "700" }}>
            {t("HOME_SEARCH_EMPTY_TITLE")}
          </PickText>

          <PickText style={{ marginTop: 6, color: COLORS.text.secondary }}>
            {t("HOME_SEARCH_EMPTY_SUBTITLE")}
          </PickText>

          <TouchableOpacity
            onPress={handleClear}
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
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
                paddingVertical: 6,
                paddingHorizontal: 16,
                borderRadius: 6,
                alignSelf: "center",
              }}
            >
              <PickText
                style={{
                  color: movie.status === "SHOWING" ? "white" : "#333",
                  fontWeight: "700",
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
    </PickView>
  );
};

export default MovieSearchScreen;
