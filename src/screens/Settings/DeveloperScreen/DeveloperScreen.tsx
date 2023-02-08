import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import * as Device from "expo-device";
import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, StyleSheet } from "react-native";
import { Button, List, useTheme } from "react-native-paper";

import { AppBar, Page } from "@components/layout";
import config from "@config";
import { useAppDispatch, useAppLoader, useSnackbar } from "@hooks";
import { type SettingsRouterNavigation } from "@screens/Settings/SettingsRouter";
import { addDebugDataThunk, setAppDeveloper } from "@store/slices/settings";
import { type IAppPopulateOptions } from "@typings/settings.types";

import DeveloperListItem from "./DeveloperListItem";

const DeveloperScreen = () => {
  const loader = useAppLoader();
  const dispatch = useAppDispatch();
  const navigator = useNavigation<SettingsRouterNavigation>();
  const { notify } = useSnackbar();
  const { t } = useTranslation(["common", "screens"]);
  const { colors } = useTheme();

  /**
   * Populate the app state
   */
  const onAppPopulate = () => {
    const populateOptions: IAppPopulateOptions = {
      days: true,
    };

    Alert.alert(
      t("screens:settingsDeveloper.populateDataTitle"),
      t("screens:settingsDeveloper.populateDataDescription"),
      [
        { text: t("common:choices.cancel"), style: "cancel" },
        {
          text: t("common:choices.confirm"),
          onPress: async (): Promise<void> => {
            loader.show(t("screens:settingsDeveloper.populateDataLoading"));
            await dispatch(addDebugDataThunk(populateOptions));
            loader.hide();
            notify(t("screens:settingsDeveloper.populateDataSuccess"));
          },
        },
      ],
    );
  };

  /**
   * Exit developer mode
   */
  const onExitDeveloper = () => {
    Alert.alert(
      t("screens:settingsDeveloper.exitDeveloperConfirmTitle"),
      t("screens:settingsDeveloper.exitDeveloperConfirmDescription"),
      [
        { text: t("common:choices.cancel"), style: "cancel" },
        {
          text: t("common:choices.confirm"),
          onPress: async (): Promise<void> => {
            dispatch(setAppDeveloper(false));

            navigator.goBack();
          },
        },
      ],
    );
  };

  return (
    <Page>
      <AppBar title={t("screens:settingsDeveloper.title")} />
      <ScrollView contentContainerStyle={styles.pageContent}>
        <List.Subheader style={styles.listSubheader}>
          {t("screens:settingsDeveloper.listSectionApp")}
        </List.Subheader>
        {/* NOTE: 'Application.nativeAppVersion' shows Expo version if running in Expo! */}
        <DeveloperListItem
          title={t("screens:settingsDeveloper.listItemBuildVersion")}
          value={config.build.version}
        />
        <DeveloperListItem
          title={t("screens:settingsDeveloper.listItemBuildNumber")}
          value={config.build.versionBuild}
        />
        <DeveloperListItem
          title={t("screens:settingsDeveloper.listItemBuildHash")}
          value={config.build.versionHash}
        />
        <DeveloperListItem
          title={t("screens:settingsDeveloper.listItemReleaseChannel")}
          value={config.build.releaseChannel}
        />
        <DeveloperListItem
          title={t("screens:settingsDeveloper.listItemRuntimeVersion")}
          value={config.build.runtimeVersion}
        />
        <DeveloperListItem
          title={t("screens:settingsDeveloper.listItemExpo")}
          value={Constants.expoVersion ?? "N/A"}
        />
        <List.Subheader style={styles.listSubheader}>
          {t("screens:settingsDeveloper.listSectionDevice")}
        </List.Subheader>
        <DeveloperListItem
          title={t("screens:settingsDeveloper.listItemDeviceModel")}
          value={Device.modelName ?? "N/A"}
        />
        <DeveloperListItem
          title={t("screens:settingsDeveloper.listItemDeviceOS")}
          // NOTE: Hacky fix for odd bug with lengthy OnePlus OS name
          value={`${Device.osName?.split("/")[0]} @ v${Device.osVersion}`}
        />
        <DeveloperListItem
          title={t("screens:settingsDeveloper.listItemDeviceType")}
          value={
            Device.isDevice
              ? t("screens:settingsDeveloper.listItemDeviceTypePhone")
              : t("screens:settingsDeveloper.listItemDeviceTypeEmulator")
          }
        />
        <List.Subheader style={styles.listSubheader}>
          {t("screens:settingsDeveloper.listSectionActions")}
        </List.Subheader>
        <List.Item
          description={t("screens:settingsDeveloper.listItemPopulateDescription")}
          left={(leftProps) => <List.Icon {...leftProps} icon="database-plus" />}
          title={t("screens:settingsDeveloper.listItemPopulateTitle")}
          onLongPress={onAppPopulate}
          onPress={() => {}}
        />
        <Button style={styles.exitButton} textColor={colors.error} onPress={onExitDeveloper}>
          {t("screens:settingsDeveloper.exitDeveloperButton")}
        </Button>
      </ScrollView>
    </Page>
  );
};

const styles = StyleSheet.create({
  pageContent: {
    flexGrow: 1,
  },
  listSubheader: {
    marginTop: 16,
  },
  exitButton: {
    margin: 24,
    marginTop: "auto",
  },
});

export default DeveloperScreen;
