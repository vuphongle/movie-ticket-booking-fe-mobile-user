import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PickView, PickText } from "@Components";
import { COLORS, SPACING, FONT_SIZE } from "@Constants/theme";
import useThemedStyles from "@Theme/Hook/useThemedStyles";

const Header = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useThemedStyles();
  return (
    <PickView backgroundColor={colors.background["bg-brand-quaternary"]} paddingTop={insets.top}>
      <PickView paddingHorizontal={16} row justifySpaceBetween alignCenter marginBottom={10}>
        <PickView></PickView>
        <PickView row gap={SPACING.md}>
          <PickText size={16}>🔍</PickText>
          <PickText size={16}>🔔</PickText>
        </PickView>
      </PickView>

      <PickView centerItems>
        <PickText color="body-inverted" size={FONT_SIZE.md}>
          Chào mừng bạn đến với
        </PickText>
        <PickText style={styles.appTitle}>GO CINEMA</PickText>
        <PickText style={styles.subtitle}>Khám phá những bộ phim hay nhất</PickText>
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
  subtitle: {
    color: COLORS.text.light,
    fontSize: FONT_SIZE.sm,
    textAlign: "center",
  },
});

export default Header;
