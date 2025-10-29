import { PickInput } from "@Components";
import React from "react";
import { Controller } from "react-hook-form";
import { TextInputProps, ViewStyle, TextInput, TextStyle } from "react-native";

interface IProps extends TextInputProps {
  control: any;
  name: string;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  containerStyle?: ViewStyle;
  suffixText?: string;
  suffixTextStyle?: TextStyle;
}

const PickFormInput = React.forwardRef<TextInput, IProps>(
  (
    { control, name, placeholder, label, disabled = false, suffixText, suffixTextStyle, ...rest },
    ref
  ) => {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <PickInput
            ref={ref}
            disabled={disabled}
            onChangeText={onChange}
            value={value}
            label={label}
            placeholder={placeholder}
            suffixText={suffixText}
            suffixTextStyle={suffixTextStyle}
            isError={!!error}
            {...rest}
          />
        )}
      />
    );
  }
);

PickFormInput.displayName = "PickFormInput";

export { PickFormInput };
