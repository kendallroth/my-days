import React, { forwardRef, useImperativeHandle, useState } from "react";
import { StyleSheet, type ViewStyle } from "react-native";
import { Appbar, Menu, useTheme } from "react-native-paper";

import { type MaterialCommunityIcons } from "@typings/app.types";

type AppBarMenuProps = {
  /** Menu items */
  children: any;
  /** Action icon */
  icon?: keyof MaterialCommunityIcons;
  /** Style */
  style?: ViewStyle;
};

type HideCallback = () => void;

export type AppBarMenuRef = {
  /**
   * Close the modal
   *
   * @param onHide - Callback executed after modal should be closed
   */
  close: (onHide?: HideCallback) => void;
};

const AppBarMenu = forwardRef<AppBarMenuRef, AppBarMenuProps>((props: AppBarMenuProps, ref) => {
  const { children, icon = "dots-vertical", style } = props;

  const [menuOpen, setMenuOpen] = useState(false);
  const { colors } = useTheme();

  useImperativeHandle(ref, (): AppBarMenuRef => {
    return {
      close,
    };
  });

  const close = (onHide?: HideCallback) => {
    if (!menuOpen) return;
    setMenuOpen(false);

    // Wait until menu should be close to call the 'onHide' callback
    // TODO: Figure out a way to detect when menu actually closes (no 'onHide' prop like 'BottomSheet')...
    setTimeout(() => {
      if (onHide && typeof onHide === "function") {
        onHide();
      }
    }, 250);
  };

  const open = () => {
    if (menuOpen) return;
    setMenuOpen(true);
  };

  return (
    <Menu
      anchor={<Appbar.Action color={colors.onPrimary} icon={icon} onPress={open} />}
      style={[styles.menuStyle, style]}
      visible={menuOpen}
      onDismiss={close}
    >
      {children}
    </Menu>
  );
});

const styles = StyleSheet.create({
  menuStyle: {
    minWidth: 200,
  },
});

export default AppBarMenu;
