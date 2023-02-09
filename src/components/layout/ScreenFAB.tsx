import { useIsFocused } from "@react-navigation/native";
import React, { type ComponentPropsWithoutRef } from "react";
import { type StyleProp, StyleSheet, type ViewStyle } from "react-native";
import { FAB } from "react-native-paper";

import { type MaterialCommunityIcons } from "@typings/app.types";

type ScreenFABProps = {
  /** FAB icon */
  icon: keyof MaterialCommunityIcons;
  style?: StyleProp<ViewStyle>;
  /** Whether FAB is visible */
  visible?: boolean;
} & Omit<ComponentPropsWithoutRef<typeof FAB>, "icon">;

const ScreenFAB = (props: ScreenFABProps) => {
  const { icon, style, visible = true, ...rest } = props;

  const isScreenFocused = useIsFocused();

  return (
    <FAB
      icon={icon}
      style={[style, styles.portalFAB]}
      visible={isScreenFocused && visible}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  portalFAB: {
    position: "absolute",
    bottom: 0,
    right: 0,
    margin: 16,
  },
});

export default ScreenFAB;
