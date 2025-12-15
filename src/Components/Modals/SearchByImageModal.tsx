import React, { useState } from "react";
import { Modal, TouchableOpacity, Image, ScrollView, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { launchImageLibrary } from "react-native-image-picker";

import { PickView, PickText } from "@Components";
import { COLORS, SPACING, FONT_SIZE, RADIUS } from "@Constants/theme";
import useThemedStyles from "@Theme/Hook/useThemedStyles";
import { movieService } from "@Services/movie/movieService";
import { useTranslation } from "@Hooks/useTranslation";
import { getMovieTitle } from "@Utils";
import UniversalConfirmModal from "@Components/Modals/UniversalConfirmModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type MovieWithStatus = any & { status?: "SHOWING" | "COMING_SOON" };

const renderTag = (movie: MovieWithStatus, t: any) => {
  if (movie.status === "SHOWING") {
    return (
      <PickView
        style={{
          backgroundColor: "#e7f9ea",
          paddingHorizontal: 8,
          paddingVertical: 3,
          borderRadius: 6,
          alignSelf: "flex-start",
          marginTop: 6,
        }}
      >
        <PickText style={{ color: "#0a9000", fontWeight: "600", fontSize: FONT_SIZE.sm }}>
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
          marginTop: 6,
        }}
      >
        <PickText style={{ color: "#d88d00", fontWeight: "600", fontSize: FONT_SIZE.sm }}>
          {t("HOME_SEARCH_TAG_COMING_SOON")}
        </PickText>
      </PickView>
    );
  }

  return null;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelectMovie?: (movie: any) => void;
};

type PickedItem = {
  id: string;
  uri: string;
  type?: string;
  fileName?: string;
};

const ACCEPTED = ["image/png", "image/jpeg", "image/jpg"];
const MAX_IMAGES = 5;

export default function SearchByImageModal({ visible, onClose, onSelectMovie }: Props) {
  const insets = useSafeAreaInsets();
  const { t, language } = useTranslation();
  const [limitModalVisible, setLimitModalVisible] = useState(false);
  const { colors } = useThemedStyles();

  const [picked, setPicked] = useState<PickedItem[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const dedupById = (list: any[]) => {
    const map = new Map<any, any>();
    for (const item of list) {
      const key = item?.id ?? `${item?.slug ?? ""}-${item?.name ?? ""}`;
      if (!map.has(key)) map.set(key, item);
    }
    return Array.from(map.values());
  };

  const resetAll = () => {
    setPicked([]);
    setResults([]);
    setShowResult(false);
    setLoading(false);
  };

  const removePicked = (id: string) => {
    setPicked((prev) => prev.filter((p) => p.id !== id));
  };

  const handlePick = async () => {
    if (picked.length >= MAX_IMAGES) {
      setLimitModalVisible(true);
      return;
    }

    const res = await launchImageLibrary({
      mediaType: "photo",
      selectionLimit: MAX_IMAGES - picked.length,
      quality: 0.9,
    });

    if (res.didCancel) return;

    const assets = res.assets ?? [];
    const valid: PickedItem[] = [];

    for (const a of assets) {
      if (!a.uri) continue;

      const mime = a.type || "image/jpeg";
      if (!ACCEPTED.includes(mime)) continue;

      valid.push({
        id: `${a.fileName ?? "img"}-${a.fileSize ?? 0}-${Date.now()}-${Math.random()
          .toString(16)
          .slice(2)}`,
        uri: a.uri,
        type: mime,
        fileName: a.fileName ?? `search-${Date.now()}.jpg`,
      });
    }

    setPicked((prev) => {
      const exists = new Set(prev.map((p) => `${p.uri}-${p.fileName}`));
      const filtered = valid.filter((v) => !exists.has(`${v.uri}-${v.fileName}`));
      const limited = filtered.slice(0, MAX_IMAGES - prev.length);
      return [...prev, ...limited];
    });

    setShowResult(false);
    setResults([]);
  };

  const canSearch = picked.length > 0 && !loading;

  const handleSearch = async () => {
    if (!picked.length) return;

    setLoading(true);
    try {
      const [showingNow, comingSoon] = await Promise.all([
        movieService.getShowingNowMovies(),
        movieService.getComingSoonMovies(),
      ]);

      const showingIds = new Set(showingNow.map((m: any) => m.id));
      const comingIds = new Set(comingSoon.map((m: any) => m.id));

      const all: any[] = [];

      for (const p of picked) {
        try {
          const list = await movieService.searchByImage({
            uri: p.uri,
            type: p.type,
            fileName: p.fileName,
          });

          if (Array.isArray(list)) all.push(...list);
        } catch (e) {
          console.log("searchByImage failed:", e);
        }
      }

      const deduped = dedupById(all);

      const processed: MovieWithStatus[] = deduped.map((m: any) => ({
        ...m,
        status: showingIds.has(m.id) ? "SHOWING" : comingIds.has(m.id) ? "COMING_SOON" : undefined,
      }));

      setResults(processed);
      setShowResult(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={() => {
        onClose();
        resetAll();
      }}
    >
      <PickView flex={1} backgroundColor={COLORS.background}>
        <PickView
          row
          alignCenter
          justifySpaceBetween
          paddingHorizontal={SPACING.md}
          paddingVertical={SPACING.md}
          style={{
            backgroundColor: "#012e6e",
            paddingTop: Math.min(insets.top, 24) + SPACING.md,
            paddingBottom: SPACING.md,
          }}
        >
          <PickView row alignCenter gap={8}>
            <Icon name="image-outline" size={20} color="white" />
            <PickText style={{ color: "white", fontWeight: "800", fontSize: 16 }}>
              {t("SEARCH_BY_IMAGE") || "Tìm bằng hình ảnh"}
            </PickText>
          </PickView>

          <TouchableOpacity
            onPress={() => {
              onClose();
              resetAll();
            }}
          >
            <PickText style={{ color: "white", fontWeight: "800", fontSize: 16 }}>
              {t("CLOSE") || "Đóng"}
            </PickText>
          </TouchableOpacity>
        </PickView>

        {loading && (
          <PickView
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255,255,255,0.6)",
              zIndex: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="large" color={colors.background["bg-brand-quaternary"]} />
          </PickView>
        )}

        {/* Body */}
        {!showResult ? (
          <PickView flex={1} padding={SPACING.md} gap={12}>
            {!picked.length ? (
              <>
                <PickText style={{ color: COLORS.text.secondary, fontSize: 13 }}>
                  {t("PLEASE_UPLOAD_ONE_OR_MORE_IMAGES_TO_SEARCH_FOR_MATCHING_MOVIES") ||
                    "Chọn 1 hoặc nhiều ảnh để tìm phim phù hợp."}
                </PickText>

                <TouchableOpacity
                  onPress={handlePick}
                  style={{
                    borderWidth: 1,
                    borderColor: "rgba(59,130,246,0.4)",
                    backgroundColor: "rgba(59,130,246,0.08)",
                    paddingVertical: 12,
                    borderRadius: 12,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Icon name="cloud-upload-outline" size={18} color="#2563eb" />
                  <PickText style={{ color: "#2563eb", fontWeight: "800" }}>
                    {t("UPLOAD_IMAGES") || "Tải ảnh lên"}
                  </PickText>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <PickView row gap={10}>
                    {picked.map((p) => (
                      <PickView key={p.id} style={{ position: "relative" }}>
                        <Image
                          source={{ uri: p.uri }}
                          style={{
                            width: 140,
                            height: 140,
                            borderRadius: 12,
                            backgroundColor: "#eee",
                          }}
                        />
                        <TouchableOpacity
                          onPress={() => removePicked(p.id)}
                          style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            width: 28,
                            height: 28,
                            borderRadius: 99,
                            backgroundColor: "rgba(239,68,68,0.2)",
                            borderWidth: 1,
                            borderColor: "rgba(239,68,68,0.35)",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Icon name="close" size={16} color="#ef4444" />
                        </TouchableOpacity>
                      </PickView>
                    ))}
                  </PickView>
                </ScrollView>

                <TouchableOpacity
                  onPress={handlePick}
                  style={{
                    borderWidth: 1,
                    borderColor: "rgba(59,130,246,0.4)",
                    backgroundColor: "rgba(59,130,246,0.08)",
                    paddingVertical: 10,
                    borderRadius: 12,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Icon name="add-circle-outline" size={18} color="#2563eb" />
                  <PickText style={{ color: "#2563eb", fontWeight: "800" }}>
                    {t("UPLOAD_MORE_IMAGES") || "Chọn thêm ảnh"}
                  </PickText>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              disabled={!canSearch}
              onPress={handleSearch}
              style={{
                marginTop: 6,
                backgroundColor: "#012e6e",
                opacity: canSearch ? 1 : 0.6,
                paddingVertical: 12,
                borderRadius: 999,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Icon name="search-outline" size={18} color="white" />
              <PickText style={{ color: "white", fontWeight: "900" }}>
                {t("SEARCH") || "Tìm kiếm"}
              </PickText>
            </TouchableOpacity>
          </PickView>
        ) : (
          <PickView flex={1} padding={SPACING.md}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <PickView row gap={10} style={{ marginBottom: 12 }}>
                {picked.map((p) => (
                  <Image
                    key={p.id}
                    source={{ uri: p.uri }}
                    style={{ width: 90, height: 90, borderRadius: 12 }}
                  />
                ))}
              </PickView>
            </ScrollView>

            {results.length > 0 ? (
              <>
                <PickText style={{ fontWeight: "900", marginTop: 16, marginBottom: 8 }}>
                  {t("SEARCH_RESULTS") || "Kết quả"}:
                </PickText>

                <ScrollView showsVerticalScrollIndicator={false}>
                  {results.map((movie) => (
                    <TouchableOpacity
                      key={movie.id}
                      onPress={() => onSelectMovie?.(movie)}
                      style={{
                        flexDirection: "row",
                        gap: 12,
                        padding: SPACING.md,
                        backgroundColor: COLORS.surface,
                        borderRadius: RADIUS.md,
                        marginBottom: SPACING.sm,
                      }}
                    >
                      <Image
                        source={{ uri: movie.poster }}
                        style={{ width: 70, height: 100, borderRadius: 10 }}
                      />
                      <PickView flex={1}>
                        <PickText style={{ fontWeight: "800", fontSize: 16 }}>
                          {getMovieTitle(movie, language)}
                        </PickText>
                        <PickText style={{ color: COLORS.text.secondary, marginTop: 6 }}>
                          {t("MOVIE_DURATION") || "Thời lượng"}: {movie.duration}{" "}
                          {t("MOVIE_DURATION_UNIT")}
                        </PickText>
                        {renderTag(movie, t)}
                      </PickView>
                      <TouchableOpacity
                        onPress={() => onSelectMovie?.(movie)}
                        style={{
                          backgroundColor: movie.status === "SHOWING" ? "#012e6e" : "#e5e5e5",
                          paddingVertical: 6,
                          paddingHorizontal: 14,
                          borderRadius: 8,
                          alignSelf: "center",
                        }}
                      >
                        <PickText
                          style={{
                            color: movie.status === "SHOWING" ? "white" : "#333",
                            fontWeight: "800",
                          }}
                        >
                          {movie.status === "SHOWING"
                            ? t("HOME_SEARCH_BUTTON_BOOK")
                            : t("HOME_SEARCH_BUTTON_INFO")}
                        </PickText>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            ) : (
              <PickText style={{ color: "#ef4444", fontWeight: "800" }}>
                {t("NO_RESULTS_FOUND") || "Không tìm thấy kết quả"}
              </PickText>
            )}

            <TouchableOpacity
              onPress={() => resetAll()}
              style={{ marginTop: 12, alignItems: "center" }}
            >
              <PickText style={{ color: "#2563eb", fontWeight: "900" }}>
                {t("SEARCH_WITH_OTHER_IMAGES") || "Tìm kiếm bằng các ảnh khác"}
              </PickText>
            </TouchableOpacity>
          </PickView>
        )}
      </PickView>
      <UniversalConfirmModal
        visible={limitModalVisible}
        title={t("SEARCH_IMAGE_LIMIT_TITLE")}
        message={t("SEARCH_IMAGE_LIMIT_MESSAGE", { max: MAX_IMAGES })}
        buttons={[
          {
            text: t("COMMON_OK"),
            type: "primary",
            onPress: () => setLimitModalVisible(false),
          },
        ]}
      />
    </Modal>
  );
}
