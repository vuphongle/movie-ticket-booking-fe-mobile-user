import React from "react";
import { TouchableOpacity } from "react-native";
import { PickText } from "@Components";
import { SPACING, FONT_SIZE, RADIUS } from "@Constants/theme";
import { useTranslation } from "@Hooks/useTranslation";

const WEEKDAY_KEYS = [
  "COMMON_WEEKDAY_MON",
  "COMMON_WEEKDAY_TUE",
  "COMMON_WEEKDAY_WED",
  "COMMON_WEEKDAY_THU",
  "COMMON_WEEKDAY_FRI",
  "COMMON_WEEKDAY_SAT",
  "COMMON_WEEKDAY_SUN",
] as const;
const pad = (n: number) => n.toString().padStart(2, "0");

interface DateButtonProps {
  date: Date;
  isActive: boolean;
  onPress: (d: Date) => void;
}

const DateButton: React.FC<DateButtonProps> = ({ date, isActive, onPress }) => {
  const { t } = useTranslation();
  const weekday = t(WEEKDAY_KEYS[(date.getDay() + 6) % 7]);
  const isToday = date.toDateString() === new Date().toDateString();

  return (
    <TouchableOpacity
      onPress={() => onPress(date)}
      activeOpacity={0.8}
      style={{
        backgroundColor: isActive ? "#002d6d" : "#F0F3F7",
        borderRadius: RADIUS.sm,
        paddingVertical: 8,
        paddingHorizontal: 14,
        marginRight: SPACING.sm,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: isActive ? "#000" : "transparent",
        shadowOffset: { width: 0, height: isActive ? 4 : 0 },
        shadowOpacity: isActive ? 0.2 : 0,
        shadowRadius: isActive ? 4 : 0,
        elevation: isActive ? 4 : 0,
        borderColor: isActive ? "transparent" : "#002d6d",
        borderWidth: isActive ? 0 : 1,
      }}
    >
      <PickText
        style={{
          fontSize: FONT_SIZE.sm,
          textAlign: "center",
          lineHeight: 18,
          color: isActive ? "#FFFFFF" : "#4F4F4F",
          fontWeight: "700",
        }}
      >
        {isToday
          ? `${t("COMMON_TODAY")}\n${pad(date.getDate())}/${pad(date.getMonth() + 1)}`
          : `${weekday}\n${pad(date.getDate())}/${pad(date.getMonth() + 1)}`}
      </PickText>
    </TouchableOpacity>
  );
};

export default DateButton;
