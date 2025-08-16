import React from 'react';
import {Text as RNText, StyleProp, TextStyle} from 'react-native';

interface PickTextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  color?: string;
  fontSize?: number;
  fontWeight?:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  numberOfLines?: number;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption';
}

const getVariantStyle = (variant?: string): TextStyle => {
  switch (variant) {
    case 'h1':
      return {fontSize: 32, fontWeight: 'bold'};
    case 'h2':
      return {fontSize: 28, fontWeight: 'bold'};
    case 'h3':
      return {fontSize: 24, fontWeight: '600'};
    case 'h4':
      return {fontSize: 20, fontWeight: '600'};
    case 'body':
      return {fontSize: 16, fontWeight: 'normal'};
    case 'caption':
      return {fontSize: 12, fontWeight: 'normal'};
    default:
      return {fontSize: 16, fontWeight: 'normal'};
  }
};

export const PickText: React.FC<PickTextProps> = ({
  children,
  style,
  color = '#000',
  fontSize,
  fontWeight,
  textAlign,
  numberOfLines,
  variant,
  ...props
}) => {
  const variantStyle = getVariantStyle(variant);

  const combinedStyle: TextStyle = {
    ...variantStyle,
    color,
    ...(fontSize && {fontSize}),
    ...(fontWeight && {fontWeight}),
    ...(textAlign && {textAlign}),
  };

  return (
    <RNText
      style={[combinedStyle, style]}
      numberOfLines={numberOfLines}
      {...props}>
      {children}
    </RNText>
  );
};
