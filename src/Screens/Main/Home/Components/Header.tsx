import { StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PickView, PickText } from "@Components";
import { COLORS, SPACING, FONT_SIZE } from "@Constants/theme";
import useThemedStyles from "@Theme/Hook/useThemedStyles";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "@Hooks/useTranslation";

const Header = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useThemedStyles();
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  return (
    <PickView
      backgroundColor={colors.background["bg-brand-quaternary"]}
      paddingTop={insets.top}
      paddingBottom={SPACING.lg}
    >
      <PickView paddingHorizontal={16} row justifySpaceBetween alignCenter marginBottom={10}>
        <PickView />

        <PickView row gap={SPACING.md}>
          {/* NÚT SEARCH */}
          <TouchableOpacity
            onPress={() => navigation.navigate("MovieSearch")}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(255,255,255,0.18)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon name="search-outline" size={22} color="#fff" />
          </TouchableOpacity>

          {/* NÚT THÔNG BÁO */}
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(255,255,255,0.18)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon name="notifications-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </PickView>
      </PickView>

      {/* --- TITLE TEXTS --- */}
      <PickView centerItems>
        <PickText color="body-inverted" size={FONT_SIZE.md}>
          {t("HOME_WELCOME")}
        </PickText>

        <PickText style={styles.appTitle}>{t("COMMON_APP_NAME").toUpperCase()}</PickText>
      </PickView>
    </PickView>
  );
};

const styles = StyleSheet.create({
  appTitle: {
    color: COLORS.text.white,
    fontSize: FONT_SIZE.xxxl,
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: SPACING.sm,
    lineHeight: 40,
  },
});

export default Header;
