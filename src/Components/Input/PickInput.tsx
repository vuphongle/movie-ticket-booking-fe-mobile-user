import React, { useMemo, useState, useRef, forwardRef, useImperativeHandle } from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
  Pressable,
} from "react-native";

import { PickText } from "@Components/PickText";
import useThemedStyles from "@Theme/Hook/useThemedStyles";
import { scale } from "@Theme/Scale";
import { fontStyle } from "@Theme/TextStyles";

interface CustomInputProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
  helperText?: string;
  onInfoPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  helperTextStyle?: TextStyle;
  disabled?: boolean;
  isError?: boolean;
  suffixText?: string;
  suffixTextStyle?: TextStyle;
}

export const PickInput = forwardRef<TextInput, CustomInputProps>(
  (
    {
      label,
      placeholder,
      helperText,
      keyboardType = "default",
      secureTextEntry = false,
      iconBefore,
      iconAfter,
      onChangeText,
      value,
      containerStyle,
      inputStyle,
      helperTextStyle,
      disabled = false,
      isError = false,
      labelStyle,
      suffixText,
      suffixTextStyle,
      onFocus,
      onBlur,
      ...rest
    },
    ref
  ) => {
    const { colors, spacing } = useThemedStyles();
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<TextInput>(null);

    // Expose the actual TextInput ref to parent component
    useImperativeHandle(ref, () => inputRef.current as TextInput);

    const inputWrapperStyle = useMemo(() => {
      const baseStyle = {
        backgroundColor: disabled
          ? colors.background["bg-secondary"]
          : colors.background["bg-primary"],
        borderColor: isError
          ? colors.border["border-error"]
          : isFocused
          ? colors.border["border-brand-click"]
          : colors.border["border-primary"],
        borderWidth: isFocused ? 2 : scale(1),
        gap: spacing.s8,
      };
      return [styles.inputWrapper, baseStyle, inputStyle];
    }, [isFocused, disabled, colors, spacing, isError, inputStyle]);

    return (
      <View style={[{ marginBottom: spacing.s16, gap: spacing.s8 }, containerStyle]}>
        {label && (
          <PickText variant="caption_large" color="heading-secondary" style={labelStyle}>
            {label}
          </PickText>
        )}

        <Pressable
          onPress={() => inputRef.current?.focus()}
          style={inputWrapperStyle}
          disabled={disabled}
          hitSlop={8}
        >
          {iconBefore}
          <TextInput
            ref={inputRef}
            style={[
              styles.textInput,
              {
                color: disabled ? colors.text["placeholder"] : colors.text["heading-primary"],
                ...fontStyle.body_small,
              },
            ]}
            placeholder={placeholder}
            placeholderTextColor="#888"
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            onChangeText={onChangeText}
            value={value}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            editable={!disabled}
            pointerEvents={disabled ? "none" : "auto"}
            accessibilityState={{ disabled }}
            accessibilityLabel={label || placeholder}
            {...rest}
          />
          {iconAfter ? (
            iconAfter
          ) : suffixText ? (
            <PickText
              variant="body_small"
              color="heading-secondary"
              style={[{ opacity: 0.8 }, suffixTextStyle]}
            >
              {suffixText}
            </PickText>
          ) : null}
          {disabled && <View style={styles.disabledOverlay} pointerEvents="none" />}
        </Pressable>

        {!!helperText && (
          <PickText
            variant="caption_small"
            color={isError ? "error-primary" : "heading-secondary"}
            style={helperTextStyle}
          >
            {helperText}
          </PickText>
        )}
      </View>
    );
  }
);

PickInput.displayName = "PickInput";

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: scale(10),
    paddingHorizontal: scale(12),
  },
  textInput: {
    height: 48,
    fontSize: 16,
    flex: 1,
    paddingVertical: 0,
  },
  disabledOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});
