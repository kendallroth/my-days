import { openURL } from "expo-linking";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Platform, StyleSheet, View } from "react-native";
import { List, Text, useTheme } from "react-native-paper";

import { type BottomSheetRef } from "@components/dialogs/BottomSheet";
import { LanguageIcon } from "@components/icons";
import { AppBar, Page } from "@components/layout";
import config from "@config";
import { useAppDispatch, useAppLoader, useAppSelector, useSnackbar } from "@hooks";
import {
  resetAppThunk,
  selectDeveloperMode,
  selectLanguageConfig,
  selectThemeConfig,
  setAppDeveloper,
  setAppLanguage,
  setAppTheme,
} from "@store/slices/settings";
import { type AppLanguage, type AppResetOptions, type AppTheme } from "@typings/settings.types";
import { LANGUAGES } from "@utilities/constants";
import { sleep } from "@utilities/misc.util";

import { AppResetModal } from "./AppResetModal";
import { LanguageModal } from "./LanguageModal";
import SettingsListItem from "./SettingsListItem";
import { ThemeModal } from "./ThemeModal";

const DEVELOPER_MODE_TAPS = 10;

const SettingsScreen = () => {
  const appResetRef = useRef<BottomSheetRef>(null);
  const languageRef = useRef<BottomSheetRef>(null);
  const themeRef = useRef<BottomSheetRef>(null);
  const [debugCounter, setDebugCounter] = useState(0);

  const dispatch = useAppDispatch();
  const loader = useAppLoader();
  const { notify } = useSnackbar();
  const { colors } = useTheme();
  const { i18n, t } = useTranslation(["common", "screens"]);

  const languageConfig = useAppSelector(selectLanguageConfig);
  const themeConfig = useAppSelector(selectThemeConfig);
  const developerMode = useAppSelector(selectDeveloperMode);

  const releaseString = config.build.releaseChannel && ` @ ${config.build.releaseChannel}`;
  const showEnvironment = developerMode && Boolean(releaseString);

  /**
   * Open the language selector
   */
  const onOpenLanguage = () => {
    languageRef.current?.open();
  };

  /**
   * Open the theme selector
   */
  const onOpenTheme = () => {
    themeRef.current?.open();
  };

  /**
   * Open the app reset selector
   */
  const onOpenAppReset = () => {
    appResetRef.current?.open();
  };

  /**
   * Reset the app state
   *
   * @param resetOptions - App reset options
   */
  const onAppReset = (resetOptions: AppResetOptions) => {
    Alert.alert(
      t("screens:settingsDeveloper.resetDataTitle"),
      t("screens:settingsDeveloper.resetDataDescription"),
      [
        { text: t("common:choices.cancel"), style: "cancel" },
        {
          text: t("common:choices.confirm"),
          onPress: async (): Promise<void> => {
            appResetRef.current?.close();

            // NOTE: Need to wait until modal has closed before displaying loading indicator on iOS
            if (Platform.OS === "ios") {
              await sleep(300);
            }

            loader.show(t("screens:settingsDeveloper.resetDataLoading"));
            await dispatch(resetAppThunk(resetOptions));
            loader.hide();
            notify(t("screens:settingsDeveloper.resetDataSuccess"));
          },
        },
      ],
    );
  };

  /**
   * Set the selected app language
   *
   * @param value - App language
   */
  const onSelectLanguage = (value: AppLanguage) => {
    // Skip updating app language if selection is current language
    if (value === languageConfig.code) {
      languageRef.current?.close();
      return;
    }

    // Change language in localization context
    i18n.changeLanguage(value);

    dispatch(setAppLanguage(value));

    languageRef.current?.close();

    if (LANGUAGES[value].beta) {
      // Need to allow language sheet to close before showing notification
      setTimeout(() => {
        notify(t("screens:settingsLanguage.betaWarning"));
      }, 750);
    }
  };

  /**
   * Set the selected theme
   *
   * @param value - App theme
   */
  const onSelectTheme = (value: AppTheme) => {
    dispatch(setAppTheme(value));

    themeRef.current?.close();
  };

  /**
   * Allow users to suggest an improvement (via email)
   */
  const onSuggestImprovement = () => {
    openURL(`mailto:${config.links.developerEmail}?subject="My Days" Suggestion`);
  };

  /**
   * Increase developer tap counter
   */
  const onTapVersion = () => {
    if (developerMode) return;

    const newCount = debugCounter + 1;

    // Enable developer mode once enough taps have accumulated
    if (newCount >= DEVELOPER_MODE_TAPS) {
      setDebugCounter(0);
      dispatch(setAppDeveloper(true));
    } else {
      setDebugCounter(newCount);
    }
  };

  return (
    <Page>
      <AppBar title={t("screens:settings.title")} />
      <SettingsListItem icon="information" route="About" title={t("screens:settingsAbout.title")} />
      <SettingsListItem
        icon="account-multiple"
        route="Contributors"
        title={t("screens:settingsContributors.title")}
      />
      <List.Subheader>{t("screens:settings.listSectionCustomize")}</List.Subheader>
      <SettingsListItem
        icon="flag"
        right={(rightProps) => (
          <LanguageIcon
            {...rightProps}
            beta={languageConfig.beta}
            flag={languageConfig.flag}
            size={30}
          />
        )}
        title={t("screens:settings.listItemLanguage")}
        onPress={onOpenLanguage}
      />
      <SettingsListItem
        icon="palette"
        right={(rightProps) => <List.Icon {...rightProps} icon={themeConfig.icon} />}
        title={t("screens:settings.listItemAppearance")}
        onPress={onOpenTheme}
      />
      <SettingsListItem
        icon="tools"
        route="Behaviours"
        title={t("screens:settings.listItemBehaviours")}
      />
      <List.Subheader>{t("screens:settings.listSectionHelp")}</List.Subheader>
      <SettingsListItem icon="bug" route="ReportBug" title={t("screens:settings.listItemBug")} />
      <SettingsListItem
        icon="lightbulb-on"
        title={t("screens:settings.listItemSuggestion")}
        right={(rightProps) => <List.Icon {...rightProps} icon="email-send" />}
        onPress={onSuggestImprovement}
      />
      <List.Item
        description={t("screens:settingsDeveloper.listItemResetDescription")}
        left={(leftProps) => <List.Icon {...leftProps} color={colors.primary} icon="lock-reset" />}
        title={t("screens:settingsDeveloper.listItemResetTitle")}
        onLongPress={onOpenAppReset}
        onPress={() => {}}
      />
      {developerMode && (
        <SettingsListItem
          icon="cellphone-information"
          route="Developer"
          title={t("screens:settingsDeveloper.title")}
        />
      )}
      <View style={styles.settingsFooter}>
        <View style={styles.settingsFooterDebug}>
          <Text onPress={onTapVersion}>v{config.build.version}</Text>
          {showEnvironment && (
            <Text style={{ color: colors.onSurfaceDisabled }}>{releaseString}</Text>
          )}
        </View>
      </View>
      <AppResetModal ref={appResetRef} onReset={onAppReset} />
      <LanguageModal ref={languageRef} language={languageConfig.code} onSelect={onSelectLanguage} />
      <ThemeModal ref={themeRef} theme={themeConfig.code} onSelect={onSelectTheme} />
    </Page>
  );
};

const styles = StyleSheet.create({
  settingsFooter: {
    marginTop: "auto",
    alignItems: "center",
    paddingVertical: 16,
  },
  settingsFooterDebug: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 8,
  },
});

export default SettingsScreen;
