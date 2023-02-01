import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";
import React, { ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

// Components
import { AppBar, Page } from "@components/layout";
import { Alert } from "@components/typography";

// Utilities
import { useAppSelector, useSnackbar } from "@hooks";
import { selectDays } from "@store/slices/days";
import { lightColors, sharedColors } from "@styles/theme";

// Types
import { RootRouterNavigation } from "src/AppRouter";
import DayDashboard from "./DayDashboard";

const HomeScreen = (): ReactElement | null => {
  const navigation = useNavigation<RootRouterNavigation>();

  const { notifyError } = useSnackbar();
  const days = useAppSelector(selectDays);
  const { t } = useTranslation(["common", "screens"]);

  const today = dayjs();
  const dateDisplay = {
    date: today.format("MMMM DD, YYYY"),
    weekDay: today.format("dddd"),
  };

  // TODO: Use tabs to animate between dashboard and list view
  const [dashboardView, setDashboardView] = useState(true);

  /** Toggle between dashboard and list views */
  const handleToggleView = (): void => {
    setDashboardView(!dashboardView);
  };

  return (
    <Page>
      <AppBar back={false} background={lightColors.primary} logo>
        <AppBar.Action
          icon={dashboardView ? "view-dashboard" : "view-list"}
          onPress={handleToggleView}
        />
        <AppBar.Action icon="cog" onPress={(): void => navigation.navigate("SettingsRouter")} />
      </AppBar>
      <View style={styles.pageHeader}>
        <Text style={styles.pageHeaderDay}>{dateDisplay.weekDay}</Text>
        <Text style={styles.pageHeaderDate}>{dateDisplay.date}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.pageContent} style={styles.pageScroll}>
        {dashboardView ? (
          <DayDashboard />
        ) : (
          <View style={styles.notImplemented}>
            <Alert>{t("common:errors.notImplemented")}</Alert>
          </View>
        )}
      </ScrollView>
    </Page>
  );
};

const styles = StyleSheet.create({
  pageContent: {},
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
  pageScroll: {
    flex: 1,
  },
  notImplemented: {
    marginTop: 32,
    marginBottom: 8,
    alignSelf: "center",
  },
});

export default HomeScreen;
