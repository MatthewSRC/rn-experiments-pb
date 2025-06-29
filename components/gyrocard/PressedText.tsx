import React from 'react';
import { Text, TextStyle } from 'react-native';

import { CARVED_COLORS } from './metalliccard/constants';
import { MetallicType } from './metalliccard/types';

interface PressedTextProps {
  children: React.ReactNode;
  style?: TextStyle;
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
  metallicType?: MetallicType;
  [key: string]: any;
}

export function PressedText({
  children,
  style,
  fontSize = 16,
  fontWeight = 'normal',
  metallicType = 'chrome',
  ...props
}: PressedTextProps) {
  const colors = CARVED_COLORS[metallicType];

  return (
    <Text
      style={[
        {
          fontSize,
          fontWeight,
          color: colors.base,
          textShadowColor: colors.shadow,
          textShadowOffset: { width: -1, height: -1 },
          textShadowRadius: 2,
        },
        style,
      ]}
      {...props}>
      {children}
    </Text>
  );
}
