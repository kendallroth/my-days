import React from "react";
import { type StyleProp, type ViewStyle } from "react-native";
import { Avatar } from "react-native-paper";

import { type MaterialCommunityIcons } from "@typings/app.types";

interface DayIconProps {
  backgroundColor?: string;
  borderWidth?: number;
  defaultIcon?: keyof MaterialCommunityIcons;
  icon: keyof MaterialCommunityIcons | null;
  iconColor?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const DayIcon = (props: DayIconProps) => {
  const {
    backgroundColor,
    borderWidth = 2,
    defaultIcon = "plus",
    icon,
    iconColor,
    size,
    style,
  } = props;

  const iconStyle: StyleProp<ViewStyle> = icon
    ? {
        backgroundColor: backgroundColor,
      }
    : {
        backgroundColor: "transparent",
        borderWidth,
        borderColor: backgroundColor,
      };

  return (
    <Avatar.Icon
      color={icon ? iconColor : backgroundColor}
      icon={icon ?? defaultIcon}
      size={size}
      style={[iconStyle, style]}
    />
  );
};

export default DayIcon;
