import { useNavigation } from "@react-navigation/native";
import React, { ReactElement } from "react";
import { Image, StatusBar, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Appbar as BaseAppBar, useTheme } from "react-native-paper";

import { lightColors, sharedColors } from "@styles/theme";

import AppBarMenu from "./AppBarMenu";

export type Props = {
  /** Background color */
  background?: string;
  /** App bar actions (right side) */
  children?: any;
  /** Whether back navigation is enabled */
  back?: boolean;
  /** Whether logo should be shown */
  logo?: boolean;
  /** Custom status bar height */
  statusBarHeight?: number;
  /** Page subtitle */
  subtitle?: string;
  /** Page title */
  title?: string;
  /** Custom back handler */
  onBack?: () => void;
};

const AppBar = (props: Props): ReactElement => {
  const {
    background,
    back = true,
    children,
    logo = false,
    statusBarHeight,
    subtitle,
    title,
    onBack,
  } = props;

  const navigation = useNavigation();
  const { dark } = useTheme();

  const transparentBackground = !background || background === sharedColors.transparent;
  const backgroundStyle: StyleProp<ViewStyle> = {
    backgroundColor: background ?? sharedColors.transparent,
  };

  return (
    <BaseAppBar.Header
      dark={transparentBackground ? dark : true}
      statusBarHeight={statusBarHeight ?? StatusBar.currentHeight}
      style={[styles.header, backgroundStyle]}
    >
      {logo && (
        <View style={styles.headerLogo}>
          <Image
            fadeDuration={100}
            resizeMode="contain"
            source={require("@assets/icon_clear.png")}
            style={styles.headerLogoImage}
          />
        </View>
      )}
      {back && <BaseAppBar.BackAction onPress={onBack ? onBack : navigation.goBack} />}
      <BaseAppBar.Content subtitle={subtitle} title={title} />
      {children}
    </BaseAppBar.Header>
  );
};

const logoSize = 32;
const styles = StyleSheet.create({
  header: {
    elevation: 0,
    shadowOpacity: 0,
  },
  headerLogo: {
    padding: 4,
    marginLeft: 8,
    borderRadius: logoSize,
    // backgroundColor: `${sharedColors.white}44`,
    backgroundColor: `${lightColors.primary}`,
  },
  headerLogoImage: {
    width: logoSize,
    height: logoSize,
  },
});

AppBar.Action = BaseAppBar.Action;
AppBar.ActionMenu = AppBarMenu;

export default AppBar;
