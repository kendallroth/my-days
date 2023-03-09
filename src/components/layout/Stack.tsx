import React, { type ReactNode } from "react";
import { type StyleProp, View, type ViewStyle } from "react-native";

interface StackProps {
  alignItems?: ViewStyle["alignItems"];
  children: ReactNode;
  direction?: "column" | "row";
  justifyContent?: ViewStyle["justifyContent"];
  /** Spacing multiplier between items (8px increments) */
  spacing?: number;
  style?: StyleProp<ViewStyle>;
}

const Stack = (props: StackProps) => {
  const {
    alignItems,
    children,
    direction = "column",
    justifyContent,
    spacing = 0,
    style = {},
  } = props;

  const styleProp: StyleProp<ViewStyle> = {
    alignItems,
    flexDirection: direction,
    gap: spacing * 8,
    justifyContent,
  };

  return <View style={[styleProp, style]}>{children}</View>;
};

export default Stack;
