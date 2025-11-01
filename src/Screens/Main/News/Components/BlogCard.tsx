import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { PickView, PickText } from "@Components";
import useThemedStyles from "@Theme/Hook/useThemedStyles";
import { BlogDto } from "@Types/blogTypes";
import { formatBackendDate } from "@Utils/dateUtils";

interface BlogCardProps {
  blog: BlogDto;
  onPress?: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onPress }) => {
  const { colors, spacing, radius } = useThemedStyles();

  const formattedDate = formatBackendDate(blog.publishedAt);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        backgroundColor: colors.background["bg-secondary"],
        borderRadius: radius.r12,
        marginBottom: spacing.s16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      <PickView row alignCenter>
        <PickView
          style={{
            width: 120,
            height: 120,
            borderTopLeftRadius: radius.r12,
            borderBottomLeftRadius: radius.r12,
            overflow: "hidden",
          }}
        >
          {blog.thumbnail ? (
            <Image
              source={{ uri: blog.thumbnail }}
              style={{ width: "100%", height: "100%", resizeMode: "cover" }}
            />
          ) : (
            <PickView
              justifyCenter
              alignCenter
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: colors.border["border-primary"],
              }}
            >
              <PickText style={{ fontSize: 36 }}>📰</PickText>
            </PickView>
          )}
        </PickView>

        {/* Content */}
        <PickView flex={1} padding={spacing.s16} style={{ justifyContent: "space-between" }}>
          <PickText
            size={16}
            font="semibold"
            numberOfLines={2}
            style={{
              color: colors.text["heading-primary"],
              marginBottom: spacing.s4,
              lineHeight: 20,
            }}
          >
            {blog.title}
          </PickText>
          <PickText
            size={14}
            numberOfLines={2}
            style={{
              color: colors.text.body,
              lineHeight: 18,
              marginBottom: spacing.s4,
            }}
          >
            {blog.description}
          </PickText>
          {formattedDate && (
            <PickText size={12} style={{ color: colors.text["heading-secondary"] }}>
              📅 {formattedDate}
            </PickText>
          )}
        </PickView>
      </PickView>
    </TouchableOpacity>
  );
};

export default BlogCard;
