import { useIsFocused } from "@react-navigation/native";
import React, { ComponentPropsWithoutRef, ReactElement } from "react";
import { StyleSheet } from "react-native";
import { FAB } from "react-native-paper";

import type { MaterialCommunityIcons } from "@typings/app.types";

type ScreenFABProps = {
  /** FAB icon */
  icon: keyof MaterialCommunityIcons;
  /** Whether FAB is visible */
  visible?: boolean;
} & Omit<ComponentPropsWithoutRef<typeof FAB>, "icon">;

const ScreenFAB = (props: ScreenFABProps): ReactElement => {
  const { icon, visible = true, ...rest } = props;

  const isScreenFocused = useIsFocused();

  return (
    <FAB icon={icon} style={styles.portalFAB} visible={isScreenFocused && visible} {...rest} />
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
