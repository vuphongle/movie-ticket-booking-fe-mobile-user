import React from "react";
import { FlatList, ActivityIndicator, ListRenderItem } from "react-native";
import { PickView, PickText } from "@Components";
import useThemedStyles from "@Theme/Hook/useThemedStyles";
import { BlogDto } from "@Types/blogTypes";
import BlogCard from "./BlogCard";
import { useBlogList } from "@Hooks/useBlogList";

interface BlogListProps {
  type?: string;
  onBlogPress?: (blog: BlogDto) => void;
}

const BlogList: React.FC<BlogListProps> = ({ type = "all", onBlogPress }) => {
  const { colors, spacing } = useThemedStyles();
  const { blogs, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, isEmpty } =
    useBlogList({ type, limit: 10 });

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderItem: ListRenderItem<BlogDto> = ({ item }) => (
    <BlogCard blog={item} onPress={() => onBlogPress?.(item)} />
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <PickView paddingVertical={spacing.s24} alignCenter>
        <ActivityIndicator size="small" color={colors.background["bg-brand-quaternary"]} />
        <PickText size={14} style={{ marginTop: spacing.s8, color: colors.text.body }}>
          Đang tải thêm...
        </PickText>
      </PickView>
    );
  };

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <PickView alignCenter justifyCenter style={{ paddingVertical: spacing.s48 * 2 }}>
          <ActivityIndicator size="large" color={colors.background["bg-brand-quaternary"]} />
          <PickText size={16} style={{ marginTop: spacing.s16, color: colors.text.body }}>
            Đang tải tin tức
          </PickText>
        </PickView>
      );
    }

    if (isError) {
      return (
        <PickView alignCenter justifyCenter style={{ paddingVertical: spacing.s48 * 2 }}>
          <PickText style={{ fontSize: 48, marginBottom: spacing.s16 }}>⚠️</PickText>
          <PickText
            size={18}
            font="semibold"
            style={{ color: colors.background["bg-error-quarternary"], marginBottom: spacing.s4 }}
          >
            Không thể tải tin tức
          </PickText>
          <PickText size={14} style={{ color: colors.text.body }}>
            Vui lòng thử lại sau
          </PickText>
        </PickView>
      );
    }

    if (isEmpty) {
      return (
        <PickView alignCenter justifyCenter style={{ paddingVertical: spacing.s48 * 2 }}>
          <PickText style={{ fontSize: 48, marginBottom: spacing.s16 }}>📭</PickText>
          <PickText
            size={18}
            font="semibold"
            style={{ color: colors.text["heading-primary"], marginBottom: spacing.s4 }}
          >
            Chưa có tin tức nào
          </PickText>
          <PickText size={14} style={{ color: colors.text.body }}>
            Hãy quay lại sau nhé!
          </PickText>
        </PickView>
      );
    }

    return null;
  };

  return (
    <FlatList
      data={blogs}
      renderItem={renderItem}
      keyExtractor={(item) => `blog-${item.id}-${item.slug}`}
      contentContainerStyle={{ padding: spacing.s16 }}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default BlogList;
