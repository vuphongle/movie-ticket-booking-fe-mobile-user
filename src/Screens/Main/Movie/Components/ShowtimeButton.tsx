import React from "react";
import { TouchableOpacity } from "react-native";
import { PickText } from "@Components";
import { SPACING, FONT_SIZE, RADIUS } from "@Constants/theme";

interface ShowtimeButtonProps {
  time: string;
  onPress: () => void;
}

const ShowtimeButton: React.FC<ShowtimeButtonProps> = ({ time, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        borderWidth: 1,
        borderColor: "#002d6d",
        borderRadius: RADIUS.xs,
        paddingVertical: 4,
        paddingHorizontal: 16,
        marginRight: SPACING.xxs,
        marginBottom: SPACING.sm,
      }}
    >
      <PickText style={{ fontSize: FONT_SIZE.sm, color: "#002d6d", fontWeight: "bold" }}>
        {time}
      </PickText>
    </TouchableOpacity>
  );
};

export default ShowtimeButton;
