import { useNavigation } from "@react-navigation/native";
import React, { ReactElement } from "react";
import { Image, StatusBar, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { Appbar as RNPAppBar, useTheme } from "react-native-paper";

import { sharedColors } from "@styles/theme";

import AppBarMenu from "./AppBarMenu";

export type Props = {
  /** Background color */
  background?: string;
  /** App bar actions (right side) */
  children?: any;
  /** App header content style */
  contentStyle?: StyleProp<TextStyle>;
  /** Whether back navigation is enabled */
  back?: boolean;
  /** Whether logo should be shown */
  logo?: boolean;
  /** Custom status bar height */
  statusBarHeight?: number;
  /** Page title */
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  /** Custom back handler */
  onBack?: () => void;
};

const AppBar = (props: Props): ReactElement => {
  const {
    background,
    back = true,
    children,
    contentStyle,
    logo = false,
    statusBarHeight,
    title,
    titleStyle,
    onBack,
  } = props;

  const navigation = useNavigation();
  const { dark } = useTheme();

  const transparentBackground = !background || background === sharedColors.transparent;
  const backgroundStyle: StyleProp<ViewStyle> = {
    backgroundColor: background ?? sharedColors.transparent,
  };

  return (
    <RNPAppBar.Header
      dark={transparentBackground ? dark : true}
      statusBarHeight={statusBarHeight ?? StatusBar.currentHeight}
      style={backgroundStyle}
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
      {back && <RNPAppBar.BackAction onPress={onBack ? onBack : navigation.goBack} />}
      <RNPAppBar.Content style={contentStyle} title={title ?? ""} titleStyle={titleStyle} />
      {children}
    </RNPAppBar.Header>
  );
};

const logoSize = 32;
const styles = StyleSheet.create({
  headerLogo: {
    padding: 4,
    marginLeft: 8,
    borderRadius: logoSize,
    backgroundColor: `${sharedColors.white}44`,
  },
  headerLogoImage: {
    width: logoSize,
    height: logoSize,
  },
});

AppBar.Action = RNPAppBar.Action;
AppBar.ActionMenu = AppBarMenu;

export default AppBar;
