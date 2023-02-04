import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { openURL } from "expo-linking";
import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

import { AppBar, Page } from "@components/layout";
import config from "@config";

const ReportBugScreen = (): ReactElement => {
  const { t } = useTranslation(["screens"]);

  const { colors } = useTheme();

  const { links } = config;

  /** Open GitHub issues */
  const onOpenGitHub = () => {
    openURL(`${links.repositoryUrl}/issues`);
  };

  return (
    <Page>
      <AppBar title={t("screens:settingsReportBug.title")} />
      <ScrollView contentContainerStyle={styles.pageContent}>
        <Icon color={colors.error} name="bug" size={64} style={styles.pageIcon} />
        <Text style={styles.pageTitle} variant="titleLarge">
          {t("screens:settingsReportBug.reportTitle")}
        </Text>
        <Text variant="bodyMedium">{t("screens:settingsReportBug.reportDescription")}</Text>
        <Button
          icon="open-in-new"
          style={styles.pageActionGitHub}
          textColor={colors.error}
          onPress={onOpenGitHub}
        >
          {t("screens:settingsReportBug.actionGitHub")}
        </Button>
      </ScrollView>
    </Page>
  );
};

const pagePadding = 24;
const styles = StyleSheet.create({
  pageContent: {
    flexGrow: 1,
    padding: pagePadding,
  },
  pageIcon: {
    alignSelf: "center",
    marginBottom: 16,
  },
  pageActionGitHub: {
    alignSelf: "center",
    marginTop: 16,
    padding: 16,
  },
  pageTitle: {
    marginBottom: 24,
    textAlign: "center",
  },
});

export default ReportBugScreen;
