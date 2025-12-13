import React from "react";
import { ScrollView, Image, TouchableOpacity, useWindowDimensions } from "react-native";
import { PickView, PickText } from "@Components";
import useThemedStyles from "@Theme/Hook/useThemedStyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@Types/navigationTypes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BlogDto } from "@Types/blogTypes";
import { useBlogDetail } from "@Hooks/useBlogDetail";
import RenderHtml from "react-native-render-html";
import Icon from "react-native-vector-icons/Ionicons";
import BlogCard from "../News/Components/BlogCard";
import { ScreenHeader } from "@Components";
import { useTranslation } from "@Hooks/useTranslation";

type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type BlogDetailRouteProp = RouteProp<RootStackParamList, "BlogDetail">;

const BlogDetailScreen: React.FC = () => {
  const { colors, spacing, radius } = useThemedStyles();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<BlogDetailRouteProp>();
  const { width } = useWindowDimensions();
  const { t } = useTranslation();

  const { id, slug } = route.params;
  const { blog, recommendBlogs, isLoading, isError, refetch } = useBlogDetail({ id, slug });

  // HTML custom styles
  const htmlStyles = {
    body: {
      color: colors.text["heading-primary"],
      fontSize: 16,
      lineHeight: 24,
    },
    p: {
      marginBottom: spacing.s16,
      color: colors.text.body,
    },
    h1: {
      fontSize: 24,
      fontWeight: "700" as const,
      marginTop: spacing.s24,
      marginBottom: spacing.s16,
      color: colors.text["heading-primary"],
    },
    h2: {
      fontSize: 20,
      fontWeight: "700" as const,
      marginTop: spacing.s24,
      marginBottom: spacing.s12,
      color: colors.text["heading-primary"],
    },
    h3: {
      fontSize: 18,
      fontWeight: "600" as const,
      marginTop: spacing.s16,
      marginBottom: spacing.s8,
      color: colors.text["heading-primary"],
    },
    ul: {
      marginBottom: spacing.s16,
      paddingLeft: spacing.s16,
    },
    li: {
      marginBottom: spacing.s8,
      color: colors.text.body,
    },
    a: {
      color: colors.background["bg-brand-quaternary"],
      textDecorationLine: "underline" as const,
    },
  };

  const handleBlogPress = (pressedBlog: BlogDto) => {
    navigation.navigate("BlogDetail", {
      id: pressedBlog.id,
      slug: pressedBlog.slug,
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <PickView flex={1} backgroundColor={colors.background["bg-primary"]}>
        {/* Header with back button */}
        <PickView
          row
          alignCenter
          paddingHorizontal={spacing.s16}
          paddingTop={insets.top + spacing.s8}
          paddingBottom={spacing.s8}
          backgroundColor={colors.background["bg-secondary"]}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: colors.border["border-primary"],
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: spacing.s8 }}>
            <Icon name="arrow-back" size={24} color={colors.text["heading-primary"]} />
          </TouchableOpacity>
        </PickView>

        {/* Loading skeleton */}
        <PickView flex={1} alignCenter justifyCenter>
          <PickText size={16} style={{ color: colors.text.body }}>
            {t("NEWS_LOADING_ARTICLE")}
          </PickText>
        </PickView>
      </PickView>
    );
  }

  // Error state
  if (isError || !blog) {
    return (
      <PickView flex={1} backgroundColor={colors.background["bg-primary"]}>
        <ScreenHeader
          title={t("NEWS_ARTICLE_DETAIL_TITLE")}
          onBackPress={() => navigation.goBack()}
        />

        {/* Error state */}
        <PickView flex={1} alignCenter justifyCenter padding={spacing.s24}>
          <PickText style={{ fontSize: 48, marginBottom: spacing.s16 }}>⚠️</PickText>
          <PickText
            size={18}
            font="semibold"
            style={{
              color: colors.background["bg-error-quarternary"],
              marginBottom: spacing.s8,
              textAlign: "center",
            }}
          >
            {t("NEWS_ARTICLE_ERROR_TITLE")}
          </PickText>
          <PickText
            size={14}
            style={{ color: colors.text.body, textAlign: "center", marginBottom: spacing.s24 }}
          >
            {t("NEWS_ARTICLE_ERROR_MESSAGE")}
          </PickText>
          <TouchableOpacity
            onPress={() => refetch()}
            style={{
              paddingHorizontal: spacing.s24,
              paddingVertical: spacing.s12,
              backgroundColor: colors.background["bg-brand-quaternary"],
              borderRadius: radius.r12,
            }}
          >
            <PickText size={14} font="semibold" style={{ color: colors.text["body-inverted"] }}>
              {t("NEWS_RETRY")}
            </PickText>
          </TouchableOpacity>
        </PickView>
      </PickView>
    );
  }

  return (
    <PickView flex={1} backgroundColor={colors.background["bg-primary"]}>
      <ScreenHeader title={t("NEWS_ARTICLE_DETAIL_TITLE")} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Thumbnail */}
        {blog.thumbnail && (
          <PickView>
            <Image
              source={{ uri: blog.thumbnail }}
              style={{
                width: "100%",
                height: 250,
                resizeMode: "cover",
              }}
            />
          </PickView>
        )}

        {/* Content */}
        <PickView padding={spacing.s16}>
          {/* Title */}
          <PickText
            size={24}
            font="bold"
            style={{
              color: colors.text["heading-primary"],
              marginBottom: spacing.s12,
              lineHeight: 32,
            }}
          >
            {blog.title}
          </PickText>

          {/* Description */}
          <PickText
            size={16}
            style={{
              color: colors.text.body,
              fontStyle: "italic",
              marginBottom: spacing.s24,
              lineHeight: 24,
            }}
          >
            {blog.description}
          </PickText>

          {/* HTML Content */}
          <RenderHtml
            contentWidth={width - spacing.s16 * 2}
            source={{ html: blog.content }}
            tagsStyles={htmlStyles}
          />
        </PickView>

        {/* Recommend Blogs Section */}
        {recommendBlogs.length > 0 && (
          <PickView
            padding={spacing.s16}
            style={{
              backgroundColor: colors.background["bg-secondary"],
              marginTop: spacing.s24,
            }}
          >
            <PickText
              size={20}
              font="bold"
              style={{
                color: colors.text["heading-primary"],
                marginBottom: spacing.s16,
              }}
            >
              {t("NEWS_RELATED")}
            </PickText>

            {recommendBlogs.map((recommendBlog) => (
              <BlogCard
                key={`recommend-${recommendBlog.id}`}
                blog={recommendBlog}
                onPress={() => handleBlogPress(recommendBlog)}
              />
            ))}
          </PickView>
        )}

        {/* Bottom padding */}
        <PickView style={{ height: spacing.s48 }} />
      </ScrollView>
    </PickView>
  );
};

export default BlogDetailScreen;
