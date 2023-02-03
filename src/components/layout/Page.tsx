import { StatusBar } from "expo-status-bar";
import React, { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

export type Props = {
  /** Page content */
  children: ReactElement | (ReactElement | false | null)[];
  invertStatusBar?: boolean;
};

/** Common page component (currently just page styles) */
const Page = (props: Props): ReactElement => {
  const { children, invertStatusBar } = props;

  const { colors, dark } = useTheme();

  // Each page renders its own status bar to ensure the color matches the page header and theme
  const statusTheme = !invertStatusBar ? (dark ? "light" : "dark") : dark ? "dark" : "light";

  const pageStyles = {
    backgroundColor: colors.background,
  };

  return (
    <View style={[styles.page, pageStyles]}>
      <StatusBar style={statusTheme} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
  },
});

export default Page;
