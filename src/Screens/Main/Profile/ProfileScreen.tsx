import React from "react";
import { ScrollView } from "react-native";
import { PickView } from "@Components";
import useThemedStyles from "@Theme/Hook/useThemedStyles";

const ProfileScreen = React.memo(() => {
  const { colors, spacing } = useThemedStyles();

  return (
    <PickView flex={1} backgroundColor={colors.background["bg-primary"]}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: spacing.s20,
          paddingBottom: spacing.s32,
          paddingHorizontal: spacing.s10,
        }}
      ></ScrollView>
    </PickView>
  );
});

export default ProfileScreen;
