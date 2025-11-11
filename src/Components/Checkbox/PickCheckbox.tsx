import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { PickView, PickText } from "@Components";
import { SPACING, FONT_SIZE } from "@Constants/theme";

interface PickCheckboxProps extends Omit<TouchableOpacityProps, "onPress"> {
  /**
   * Checkbox checked state
   */
  checked: boolean;
  /**
   * Callback khi checkbox được toggle
   */
  onToggle: (checked: boolean) => void;
  /**
   * Text label hiển thị bên cạnh checkbox
   */
  label?: string;
  /**
   * Size của checkbox
   */
  size?: "sm" | "md" | "lg";
  /**
   * Color scheme
   */
  variant?: "primary" | "secondary";
  /**
   * Disable checkbox
   */
  disabled?: boolean;
  /**
   * Custom checkbox content (thay thế label)
   */
  children?: React.ReactNode;
  /**
   * Label style override
   */
  labelStyle?: any;
  /**
   * Checkbox container style override
   */
  checkboxStyle?: any;
}

const SIZES = {
  sm: { size: 18, iconSize: 12 },
  md: { size: 22, iconSize: 14 },
  lg: { size: 26, iconSize: 16 },
};

const COLORS = {
  primary: {
    checked: "#012e6e",
    unchecked: "#FFFFFF",
    border: "#012e6e",
    borderUnchecked: "#C4C4C4",
  },
  secondary: {
    checked: "#6B7280",
    unchecked: "#FFFFFF",
    border: "#6B7280",
    borderUnchecked: "#D1D5DB",
  },
};

export const PickCheckbox: React.FC<PickCheckboxProps> = ({
  checked,
  onToggle,
  label,
  size = "md",
  variant = "primary",
  disabled = false,
  children,
  labelStyle,
  checkboxStyle,
  style,
  ...touchableProps
}) => {
  const sizeConfig = SIZES[size];
  const colorConfig = COLORS[variant];

  const handlePress = () => {
    if (!disabled) {
      onToggle(!checked);
    }
  };

  return (
    <TouchableOpacity
      style={[
        {
          flexDirection: "row",
          alignItems: "flex-start",
          gap: SPACING.sm,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      {...touchableProps}
    >
      {/* Checkbox */}
      <PickView
        style={[
          {
            width: sizeConfig.size,
            height: sizeConfig.size,
            borderWidth: 1.5,
            borderColor: checked ? colorConfig.border : colorConfig.borderUnchecked,
            borderRadius: 6,
            backgroundColor: checked ? colorConfig.checked : colorConfig.unchecked,
            justifyContent: "center",
            alignItems: "center",
            marginTop: children ? 2 : 0, // Align with text if children
          },
          checkboxStyle,
        ]}
      >
        {checked && (
          <Icon
            name="checkmark"
            size={sizeConfig.iconSize}
            color="#FFFFFF"
            style={{
              fontWeight: "bold",
            }}
          />
        )}
      </PickView>

      {/* Label or Children */}
      {children ? (
        <PickView style={{ flex: 1 }}>{children}</PickView>
      ) : (
        label && (
          <PickText
            style={[
              {
                flex: 1,
                color: disabled ? "#9CA3AF" : "#374151",
                fontSize: FONT_SIZE.sm,
                lineHeight: 20,
              },
              labelStyle,
            ]}
          >
            {label}
          </PickText>
        )
      )}
    </TouchableOpacity>
  );
};

export default PickCheckbox;
