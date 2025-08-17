import useThemedStyles from "@Theme/Hook/useThemedStyles";
import * as React from "react";
import { ActivityIndicator, Pressable, StyleProp, TextStyle, ViewStyle } from "react-native";
import type { View as ViewType } from "react-native/Libraries/Components/View/View";

interface IButtonProps {
  title?: string | React.ReactNode;
  icon: React.ReactNode;

  disabled?: boolean;
  loading?: boolean;
  destructive?: boolean;
  onPress?: Function;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  hitSlop?: number;
  type: "Primary" | "Secondary" | "Tertiary" | "Link01" | "Link02";
  children?: React.ReactNode;
  loadingColor?: string;
  numberOfLines?: number;
  size?: "xxl" | "xl" | "lg" | "md" | "sm";
}

export const PickButtonIcon = React.forwardRef((props: IButtonProps, _ref: React.Ref<ViewType>) => {
  const { buttonSize, colors, scale, radius } = useThemedStyles();
  const {
    icon,
    onPress,
    style,
    disabled,
    loading,
    destructive = false,
    hitSlop,
    type = "Primary",
    loadingColor = "#fff",
    size = "xl",
  } = props;

  const styleButton = {
    Primary: {
      button: {
        default: {
          backgroundColor: destructive
            ? colors.button["Destructive_primary"]["bg-button-destructive-primary"]
            : colors.button["Primary"]["bg-button-primary"],
        },
        click: {
          backgroundColor: destructive
            ? colors.button["Destructive_primary"]["bg-button-destructive-primary-click"]
            : colors.button["Primary"]["bg-button-primary-click"],
        },
        disabled: {
          backgroundColor: destructive
            ? colors.button["Destructive_primary"]["bg-button-destructive-primary-disabled"]
            : colors.button["Primary"]["bg-button-primary-disabled"],
        },
      },
      text: {
        default: {
          color: destructive
            ? colors.button["Destructive_primary"]["fg-button-destructive-primary"]
            : colors.button["Primary"]["fg-button-primary"],
        },
        click: {
          color: destructive
            ? colors.button["Destructive_primary"]["bg-button-destructive-primary-click"]
            : colors.button["Primary"]["bg-button-primary-click"],
        },
        disabled: {
          color: destructive
            ? colors.button["Destructive_primary"]["fg-button-destructive-primary-disabled"]
            : colors.button["Primary"]["fg-button-primary-disabled"],
        },
      },
    },
    Secondary: {
      button: {
        default: {
          borderWidth: 1,
          borderColor: destructive
            ? colors.button["Destructive_secondary"]["border-button-destructive-secondary"]
            : colors.button["Secondary"]["border-button-secondary"],
          backgroundColor: destructive
            ? colors.button["Destructive_secondary"]["bg-button-destructive-secondary"]
            : colors.button["Secondary"]["bg-button-secondary"],
        },
        click: {
          borderWidth: 1,
          borderColor: destructive
            ? colors.button["Destructive_secondary"]["border-button-destructive-secondary-click"]
            : colors.button["Secondary"]["border-button-secondary"],
          backgroundColor: destructive
            ? colors.button["Destructive_secondary"]["bg-button-destructive-secondary-click"]
            : colors.button["Secondary"]["bg-button-secondary-click"],
        },
        disabled: {
          borderWidth: 1,
          borderColor: destructive
            ? colors.button["Destructive_secondary"]["border-button-destructive-secondary-disabled"]
            : colors.button["Secondary"]["border-button-secondary"],
          backgroundColor: destructive
            ? colors.button["Destructive_secondary"]["bg-button-destructive-secondary-disabled"]
            : colors.button["Secondary"]["bg-button-secondary-disabled"],
        },
      },
      text: {
        default: {
          color: destructive
            ? colors.button["Destructive_secondary"]["fg-button-destructive-secondary"]
            : colors.button["Secondary"]["fg-button-secondary"],
        },
        click: {
          color: destructive
            ? colors.button["Destructive_secondary"]["fg-button-destructive-secondary-click"]
            : colors.button["Secondary"]["fg-button-secondary-click"],
        },
        disabled: {
          color: destructive
            ? colors.button["Destructive_secondary"]["fg-button-destructive-secondary-disabled"]
            : colors.button["Secondary"]["fg-button-secondary-disabled"],
        },
      },
    },
    Tertiary: {
      button: {
        default: {
          borderWidth: 1,
          borderColor: destructive
            ? colors.button["Destructive_tertiary"]["border-button-destructive-tertiary"]
            : colors.button["Tertiary"]["border-button-tertiary"],
          backgroundColor: destructive
            ? colors.button["Destructive_tertiary"]["bg-button-destructive-tertiary"]
            : colors.button["Tertiary"]["bg-button-tertiary"],
        },
        click: {
          borderWidth: 1,
          borderColor: destructive
            ? colors.button["Destructive_tertiary"]["border-button-destructive-tertiary-click"]
            : colors.button["Tertiary"]["bg-button-tertiary"],
          backgroundColor: destructive
            ? colors.button["Destructive_tertiary"]["bg-button-destructive-tertiary-click"]
            : colors.button["Tertiary"]["bg-button-tertiary-click"],
        },
        disabled: {
          backgroundColor: destructive
            ? colors.button["Destructive_tertiary"]["bg-button-destructive-tertiary-disabled"]
            : colors.button["Tertiary"]["bg-button-tertiary-disabled"],
        },
      },
      text: {
        default: {
          color: destructive
            ? colors.button["Destructive_tertiary"]["fg-button-destructive-tertiary"]
            : colors.button["Tertiary"]["fg-button-tertiary"],
        },
        click: {
          color: destructive
            ? colors.button["Destructive_tertiary"]["fg-button-destructive-tertiary-click"]
            : colors.button["Tertiary"]["fg-button-tertiary-click"],
        },
        disabled: {
          color: destructive
            ? colors.button["Destructive_tertiary"]["fg-button-destructive-tertiary-disabled"]
            : colors.button["Tertiary"]["fg-button-tertiary-disabled"],
        },
      },
    },
    Link01: {
      button: {
        default: {},
        click: {},
        disabled: {},
      },
      text: {
        default: {
          color: destructive
            ? colors.button["Destructive_link_01"]["fg-button-destructive-link01"]
            : colors.button["Link_01"]["fg-button-link01"],
        },
        click: {
          color: destructive
            ? colors.button["Destructive_link_01"]["fg-button-destructive-link01-click"]
            : colors.button["Link_01"]["fg-button-link01-click"],
        },
        disabled: {
          color: destructive
            ? colors.button["Destructive_link_01"]["fg-button-destructive-link01-disabled"]
            : colors.button["Link_01"]["fg-button-link01-disabled"],
        },
      },
    },
    Link02: {
      button: {
        default: {},
        click: {},
        disabled: {},
      },
      text: {
        default: {
          color: colors.button["Link_02"]["fg-button-link02"],
        },
        click: {
          color: colors.button["Link_02"]["fg-button-link02-click"],
        },
        disabled: {
          color: colors.button["Link_02"]["fg-button-link01-disabled"],
        },
      },
    },
  };

  const [_isPressed, setIsPressed] = React.useState(false);
  const renderLoading = () => {
    return <ActivityIndicator size="small" color={loadingColor} />;
  };

  const renderButtonType = () => {
    const isDisabled = disabled || loading;

    return (
      <Pressable
        hitSlop={hitSlop}
        disabled={isDisabled}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        style={({ pressed }) =>
          pressed
            ? [
                {
                  alignItems: "center",
                  justifyContent: "center",
                  gap: scale(8),
                  borderRadius: radius.r99999,
                },
                styleButton[type].button.click,
                buttonSize[size],
                style,
              ]
            : [
                {
                  alignItems: "center",
                  justifyContent: "center",
                  gap: scale(8),
                  borderRadius: radius.r99999,
                },
                styleButton[type].button.default,
                buttonSize[size],
                isDisabled && styleButton[type].button.disabled,
                style,
              ]
        }
        onPress={() => onPress && onPress()}
      >
        {loading ? renderLoading() : icon}
      </Pressable>
    );
  };
  return renderButtonType();
});
