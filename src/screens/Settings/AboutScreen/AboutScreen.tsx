import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import dayjs from "dayjs";
import { openURL } from "expo-linking";
import React, { ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { Chip, Text, useTheme } from "react-native-paper";

import { AppBar, Page } from "@components/layout";
import { Quote } from "@components/typography";
import config from "@config";
import { sharedColors } from "@theme";

import type { MaterialCommunityIcons } from "@typings/app.types";

interface IDeveloperActions {
  icon: keyof MaterialCommunityIcons;
  name: string;
  url: string;
}

const AboutScreen = (): ReactElement => {
  const { t } = useTranslation(["screens"]);

  const { colors } = useTheme();

  const { links } = config;
  const developerActions: IDeveloperActions[] = [
    {
      icon: "account",
      name: t("screens:settingsAbout.chipPortfolio"),
      url: links.developerUrl,
    },
    {
      icon: "github",
      name: t("screens:settingsAbout.chipRepository"),
      url: links.repositoryUrl,
    },
    {
      icon: "email",
      name: t("screens:settingsAbout.chipContact"),
      url: `mailto:${links.developerEmail}`,
    },
  ];

  const steps = [
    t("screens:settingsAbout.guideStep1"),
    t("screens:settingsAbout.guideStep2"),
    t("screens:settingsAbout.guideStep3"),
  ];
  const tips = [
    t("screens:settingsAbout.guideTip1"),
    t("screens:settingsAbout.guideTip2"),
    t("screens:settingsAbout.guideTip3"),
  ];

  const themeStyles = useMemo(
    () => ({
      aboutSummary: {
        borderLeftColor: colors.primary,
      },
      developerChips: {
        backgroundColor: `${colors.primary}aa`,
      },
    }),
    [colors],
  );

  /** Open an external link */
  const onLink = (link: string) => {
    openURL(link);
  };

  return (
    <Page>
      <AppBar title={t("screens:settingsAbout.title")} />
      <ScrollView contentContainerStyle={styles.pageContent} style={styles.pageScroll}>
        <Quote>{t("screens:settingsAbout.appSummary")}</Quote>
        <Text style={styles.aboutDescription}>{t("screens:settingsAbout.appDescription")}</Text>
        <View style={styles.aboutSteps}>
          {steps.map((step, idx) => (
            <View key={step} style={styles.aboutStepsStep}>
              <Icon
                color={colors.accent}
                // @ts-ignore
                name={`numeric-${idx + 1}-circle`}
                size={24}
                style={styles.aboutStepsStepIcon}
              />
              <Text style={styles.aboutStepsStepText}>{step}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.aboutTipTitle}>{t("screens:settingsAbout.guideTipTitle")}</Text>
        <View style={styles.aboutSteps}>
          {tips.map((tip) => (
            <View key={tip} style={styles.aboutStepsStep}>
              <Icon
                color={colors.accent}
                name="circle-medium"
                size={24}
                style={styles.aboutStepsStepIcon}
              />
              <Text style={[styles.aboutStepsStepText, { fontSize: 16 }]}>{tip}</Text>
            </View>
          ))}
        </View>
        <View style={styles.aboutSpace} />
        <View style={styles.aboutDeveloper}>
          <Text style={styles.aboutDeveloperText}>
            {t("screens:settingsAbout.appDeveloper", {
              date: dayjs().format("YYYY"),
            })}
          </Text>
          <View style={styles.aboutDeveloperActions}>
            {developerActions.map((action) => (
              <Chip
                key={action.name}
                icon={(iconProps): ReactElement => (
                  <Icon
                    {...iconProps}
                    color={`${sharedColors.white}aa`}
                    name={action.icon}
                    size={20}
                  />
                )}
                style={[styles.aboutDeveloperActionsChip, themeStyles.developerChips]}
                textStyle={styles.aboutDeveloperActionsText}
                onPress={() => onLink(action.url)}
              >
                {action.name}
              </Chip>
            ))}
          </View>
        </View>
      </ScrollView>
    </Page>
  );
};

const pagePadding = 24;
const styles = StyleSheet.create({
  aboutDescription: {
    marginVertical: 24,
    fontSize: 16,
  },
  aboutDeveloper: {
    marginTop: 24,
  },
  aboutDeveloperActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
  },
  aboutDeveloperActionsChip: {
    marginBottom: 8,
    marginRight: 8,
  },
  aboutDeveloperActionsText: {
    color: sharedColors.white,
    fontSize: 15,
  },
  aboutDeveloperText: {
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
    fontSize: 18,
  },
  aboutTipTitle: {
    marginTop: 24,
    marginBottom: 4,
    fontSize: 16,
    fontWeight: "700",
  },
  aboutSpace: {
    flexGrow: 1,
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
