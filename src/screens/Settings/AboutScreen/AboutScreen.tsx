import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import Constants from "expo-constants";
import { openURL } from "expo-linking";
import React from "react";
import { useTranslation } from "react-i18next";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { Chip, Surface, Text, useTheme } from "react-native-paper";

import { AppBar, Page } from "@components/layout";
import { Quote } from "@components/typography";
import config from "@config";
import { type MaterialCommunityIcons } from "@typings/app.types";

interface DeveloperActions {
  icon: keyof MaterialCommunityIcons;
  name: string;
  url: string | null;
}

const AboutScreen = () => {
  const { t } = useTranslation(["screens"]);

  const { colors } = useTheme();

  const { links } = config;

  const appStoreAction: DeveloperActions | null =
    Platform.select<DeveloperActions>({
      android: {
        icon: "google-play",
        name: "Google",
        url: Constants.expoConfig?.android?.playStoreUrl ?? null,
      },
      ios: {
        icon: "apple",
        name: "Apple",
        url: Constants.expoConfig?.ios?.appStoreUrl ?? null,
      },
    }) ?? null;

  const developerActions: DeveloperActions[] = [
    {
      icon: "account",
      name: t("screens:settingsAbout.chipPortfolio"),
      url: links.developerUrl,
    },
    {
      icon: "email",
      name: t("screens:settingsAbout.chipContact"),
      url: `mailto:${links.developerEmail}`,
    },
    {
      icon: "github",
      name: t("screens:settingsAbout.chipRepository"),
      url: links.repositoryUrl,
    },
  ];
  if (appStoreAction) {
    developerActions.push(appStoreAction);
  }

  const steps = t("screens:settingsAbout.guideSteps", { returnObjects: true });
  const tips = t("screens:settingsAbout.guideTips", { returnObjects: true });

  /** Open an external link */
  const onLink = (link: string) => {
    openURL(link);
  };

  return (
    <Page>
      <AppBar title={t("screens:settingsAbout.title")} />
      <ScrollView contentContainerStyle={styles.pageContent} style={styles.pageScroll}>
        <Quote>{t("screens:settingsAbout.appSummary")}</Quote>
        <Text style={styles.aboutDescription} variant="bodyMedium">
          {t("screens:settingsAbout.appDescription")}
        </Text>
        <View style={styles.aboutSteps}>
          {steps.map((step, idx) => (
            <View key={step} style={styles.aboutStepsStep}>
              <Icon
                color={colors.tertiary}
                // @ts-ignore
                name={`numeric-${idx + 1}-circle`}
                size={24}
                style={styles.aboutStepsStepIcon}
              />
              <Text style={styles.aboutStepsStepText} variant="bodyLarge">
                {step}
              </Text>
            </View>
          ))}
        </View>
        <Text style={styles.aboutTipTitle} variant="titleMedium">
          {t("screens:settingsAbout.guideTipTitle")}
        </Text>
        <View style={styles.aboutSteps}>
          {tips.map((tip) => (
            <View key={tip} style={styles.aboutStepsStep}>
              <Icon
                color={colors.tertiary}
                name="circle-medium"
                size={24}
                style={styles.aboutStepsStepIcon}
              />
              <Text style={[styles.aboutStepsStepText]} variant="bodyMedium">
                {tip}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.aboutSpace} />
        <View style={styles.aboutDeveloper}>
          <View style={styles.aboutDeveloperActions}>
            {developerActions.map((action) => (
              <Chip
                key={action.name}
                disabled={!action.url}
                icon={(iconProps) => <Icon {...iconProps} name={action.icon} size={20} />}
                style={styles.aboutDeveloperActionsChip}
                onPress={action.url ? () => onLink(action.url!) : undefined}
              >
                {action.name}
              </Chip>
            ))}
          </View>
          <Text style={styles.aboutDeveloperText}>
            {t("screens:settingsAbout.appDeveloper", {
              date: "2023",
            })}
          </Text>
          <Surface
            elevation={0}
            style={[styles.aboutReason, { backgroundColor: colors.tertiaryContainer }]}
          >
            <Text
              style={[styles.aboutReasonText, { color: colors.onTertiaryContainer }]}
              variant="bodySmall"
            >
              {t("screens:settingsAbout.appReason")}
            </Text>
          </Surface>
        </View>
      </ScrollView>
    </Page>
  );
};

const pagePadding = 24;
const styles = StyleSheet.create({
  aboutDescription: {
    marginVertical: 24,
  },
  aboutDeveloper: {
    marginTop: 24,
  },
  aboutDeveloperActions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  aboutDeveloperActionsChip: {
    marginBottom: 8,
    marginRight: 8,
  },
  aboutDeveloperText: {
    marginTop: 16,
    textAlign: "center",
  },
  aboutSteps: {
    paddingRight: pagePadding,
  },
  aboutStepsStep: {
    flexDirection: "row",
    marginVertical: 4,
  },
  aboutStepsStepIcon: {
    top: -1,
  },
  aboutStepsStepText: {
    marginLeft: 8,
  },
  aboutTipTitle: {
    marginTop: 24,
    marginBottom: 4,
  },
  aboutSpace: {
    flexGrow: 1,
  },
  aboutReason: {
    marginVertical: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  aboutReasonText: {
    textAlign: "center",
  },
  pageContent: {
    flexGrow: 1,
    padding: pagePadding,
  },
  pageScroll: {
    flex: 1,
  },
});

export default AboutScreen;
