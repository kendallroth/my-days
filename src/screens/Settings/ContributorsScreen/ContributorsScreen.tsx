import { openURL } from "expo-linking";
import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

import { AppBar, Page } from "@components/layout";
import { Quote } from "@components/typography";
import config from "@config";

import ContributorListItem from "./ContributorListItem";

export type ContributorActionType = "development" | "documentation" | "localization" | "testing";

interface ContributorActions {
  /** Contributor action description */
  description: string;
  /** Contributor action type */
  type: ContributorActionType;
}

export interface Contributor {
  /** List of contributor's actions */
  actions: ContributorActions[];
  /** Avatar colour */
  color?: string;
  /** Contributor name */
  name: string;
  /** Contributor website */
  website?: string;
}

const contributors: Contributor[] = [
  {
    actions: [
      { description: "Primary developer", type: "development" },
      { description: "English", type: "localization" },
    ],
    color: "#B80F0A",
    name: "Kendall Roth",
    website: "https://www.kendallroth.ca",
  },
];

const ContributorsScreen = (): ReactElement => {
  const { t } = useTranslation(["screens"]);

  /** Open an external link */
  const onLink = (link: string): void => {
    openURL(link);
  };

  return (
    <Page>
      <AppBar title={t("screens:settingsContributors.title")} />
      <ScrollView contentContainerStyle={styles.pageContent}>
        <Quote>{t("screens:settingsContributors.contributorThanks")}</Quote>
        <View style={styles.aboutContributorsList}>
          {contributors.map(
            (c, idx): ReactElement => (
              <ContributorListItem
                key={c.name}
                align={idx % 2 ? "left" : "right"}
                contributor={c}
              />
            ),
          )}
        </View>
        <View style={styles.aboutContributorsPrompt}>
          <Text style={styles.alignContributorsPromptText}>
            {t("screens:settingsContributors.contributorPrompt")}
          </Text>
          <Button
            icon="github"
            style={styles.alignContributorsPromptButton}
            onPress={() => onLink(`${config.links.repositoryUrl}/issues`)}
          >
            GitHub
          </Button>
        </View>
      </ScrollView>
    </Page>
  );
};

const pagePadding = 24;
const styles = StyleSheet.create({
  aboutContributorsList: {
    marginHorizontal: -pagePadding,
    marginVertical: 24,
  },
  aboutContributorsPrompt: {
    alignItems: "center",
  },
  alignContributorsPromptButton: {
    marginVertical: 16,
  },
  alignContributorsPromptText: {
    fontSize: 16,
  },
  pageContent: {
    flexGrow: 1,
    padding: pagePadding,
  },
});

export default ContributorsScreen;
