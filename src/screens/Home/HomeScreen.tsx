import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";
import React, { ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

// Components
import { AppBar, Page } from "@components/layout";

// Utilities
import { useAppSelector, useSnackbar } from "@hooks";
import { selectDays } from "@store/slices/days";

// Types
import { RootRouterNavigation } from "src/AppRouter";
import { Alert } from "@components/typography";
import { lightColors, sharedColors } from "@styles/theme";

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

  const [dashboardView, setDashboardView] = useState(false);

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
      <ScrollView contentContainerStyle={styles.pageScroll}>
        <View style={styles.notImplemented}>
          <Alert>{t("common:errors.notImplemented")}</Alert>
        </View>
      </ScrollView>
    </Page>
  );
};

const styles = StyleSheet.create({
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
    flexGrow: 1,
  },
  notImplemented: {
    marginTop: 48,
    marginBottom: 24,
    alignSelf: "center",
  },
});

export default HomeScreen;
