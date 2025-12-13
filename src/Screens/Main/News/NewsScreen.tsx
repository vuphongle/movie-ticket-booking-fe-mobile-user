import React, { useState } from "react";
import { TouchableOpacity, FlatList } from "react-native";
import { PickView, PickText } from "@Components";
import useThemedStyles from "@Theme/Hook/useThemedStyles";
import BlogList from "./Components/BlogList";
import { BlogDto, BlogType } from "@Types/blogTypes";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@Types/navigationTypes";
import { useTranslation } from "@Hooks/useTranslation";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Tab {
  key: string;
  label: string;
}

const NewsScreen: React.FC = () => {
  const { colors, spacing, radius } = useThemedStyles();
  const [activeTab, setActiveTab] = useState<string>(BlogType.ALL);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();

  const tabs: Tab[] = React.useMemo(
    () => [
      { key: BlogType.ALL, label: t("NEWS_TAB_ALL") },
      { key: BlogType.PHIM_CHIEU_RAP, label: t("NEWS_TAB_CINEMA") },
      { key: BlogType.TONG_HOP_PHIM, label: t("NEWS_TAB_COLLECTION") },
      { key: BlogType.PHIM_NEFLIX, label: t("NEWS_TAB_NETFLIX") },
    ],
    [t]
  );

  const handleBlogPress = (blog: BlogDto) => {
    navigation.navigate("BlogDetail", {
      id: blog.id,
      slug: blog.slug,
    });
  };

  const renderTabItem = ({ item }: { item: Tab }) => (
    <TouchableOpacity
      key={item.key}
      onPress={() => setActiveTab(item.key)}
      activeOpacity={0.7}
      style={{
        paddingHorizontal: spacing.s16,
        paddingVertical: spacing.s8,
        marginRight: spacing.s8,
        borderRadius: radius.r12,
        backgroundColor:
          activeTab === item.key
            ? colors.background["bg-brand-quaternary"]
            : colors.background["bg-primary"],
        minWidth: 80,
        alignItems: "center",
      }}
    >
      <PickText
        size={14}
        font="semibold"
        style={{
          color: activeTab === item.key ? colors.text["body-inverted"] : colors.text.body,
        }}
      >
        {item.label}
      </PickText>
    </TouchableOpacity>
  );

  return (
    <PickView
      flex={1}
      backgroundColor={colors.background["bg-primary"]}
      style={{ paddingBottom: insets.bottom + 50 }}
    >
      {/* Header */}
      <PickView
        backgroundColor={colors.background["bg-brand-quaternary"]}
        paddingHorizontal={spacing.s16}
        paddingTop={insets.top + spacing.s16}
        paddingBottom={spacing.s16}
        centerItems
        justifyCenter
        style={{
          borderBottomWidth: 1,
          borderBottomColor: colors.border["border-primary"],
        }}
      >
        <PickText size={24} font="bold" color="body-inverted" style={{ marginBottom: spacing.s4 }}>
          {t("NEWS_HEADER_TITLE")}
        </PickText>
        <PickText size={14} color="body-inverted">
          {t("NEWS_HEADER_SUBTITLE")}
        </PickText>
      </PickView>

      {/* Tabs (Tối ưu hóa bằng FlatList thay vì ScrollView.map) */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={tabs}
        renderItem={renderTabItem}
        keyExtractor={(item) => item.key}
        contentContainerStyle={{
          paddingHorizontal: spacing.s16,
          paddingVertical: spacing.s8,
        }}
        style={{
          backgroundColor: colors.background["bg-secondary"],
          borderBottomWidth: 1,
          borderBottomColor: colors.border["border-primary"],
          flexGrow: 0,
        }}
      />

      <PickView flex={1}>
        <BlogList type={activeTab} onBlogPress={handleBlogPress} />
      </PickView>
    </PickView>
  );
};

export default NewsScreen;
