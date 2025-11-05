import React from "react";
import { TouchableOpacity } from "react-native";
import { PickText, PickView } from "@Components";
import { FONT_SIZE } from "@Constants/theme";
import { COLORS } from "@Constants/theme";

interface CinemaHeaderProps {
  name: string;
  isExpanded: boolean;
  onPress: () => void;
}

const CinemaHeader: React.FC<CinemaHeaderProps> = ({ name, isExpanded, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <PickView row justifySpaceBetween alignCenter>
        <PickText
          style={{
            fontSize: FONT_SIZE.md,
            fontWeight: "bold",
            color: isExpanded ? "#002d6d" : COLORS.text.primary,
          }}
        >
          {name}
        </PickText>
        <PickText style={{ fontSize: FONT_SIZE.md, fontWeight: "600", color: COLORS.text.primary }}>
          {isExpanded ? "▲" : "▼"}
        </PickText>
      </PickView>
    </TouchableOpacity>
  );
};

export default CinemaHeader;
