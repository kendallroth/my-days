import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import React, { ReactElement, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

import { AppBar, ComingSoon, Page } from "@components/layout";
import { useSnackbar } from "@hooks";
import { lightColors, sharedColors } from "@styles/theme";

import DayList from "./DayList";

import type { RootRouterNavigation } from "src/AppRouter";

const HomeScreen = (): ReactElement | null => {
  const navigation = useNavigation<RootRouterNavigation>();

  const { notifyNotImplemented } = useSnackbar();

  const today = dayjs();
  const dateDisplay = {
    date: today.format("MMMM DD, YYYY"),
    weekDay: today.format("dddd"),
  };

  // TODO: Use tabs to animate between dashboard and list view
  const [listView, setListView] = useState(true);

  /** Toggle between dashboard and list views */
  const handleToggleView = (): void => {
    setListView(!listView);
    // notifyNotImplemented();
  };

  return (
    <Page>
      <AppBar back={false} background={lightColors.primary} logo>
        <AppBar.Action
          icon={listView ? "view-list" : "view-dashboard"}
          onPress={handleToggleView}
        />
        <AppBar.Action icon="cog" onPress={(): void => navigation.navigate("SettingsRouter")} />
      </AppBar>
      <View style={styles.pageHeader}>
        <Text style={styles.pageHeaderDay}>{dateDisplay.weekDay}</Text>
        <Text style={styles.pageHeaderDate}>{dateDisplay.date}</Text>
      </View>
      <View style={styles.pageContent}>{listView ? <DayList /> : <ComingSoon />}</View>
    </Page>
  );
};

const styles = StyleSheet.create({
  pageContent: {
    flex: 1,
  },
  pageHeader: {
    padding: 24,
    paddingTop: 8,
    backgroundColor: lightColors.primary,
  },
  pageHeaderDate: {
    color: sharedColors.white,
    fontSize: 24,
  },
  pageHeaderDay: {
    marginBottom: 4,
    color: sharedColors.white,
    fontSize: 32,
    fontWeight: "700",
  },
});

export default HomeScreen;
