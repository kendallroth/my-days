import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet } from "react-native";

import { AppBar, Page } from "@components/layout";
import { useAppDispatch, useAppSelector } from "@hooks";
import { selectBehaviours, setAppBehaviour } from "@store/slices/settings";
import { type AppBehaviours } from "@typings/settings.types";

import BehavioursScreenListItemSwitch from "./BehavioursScreenListItemSwitch";

const BehavioursScreen = () => {
  const dispatch = useAppDispatch();
  const appBehaviours = useAppSelector(selectBehaviours);
  const { t } = useTranslation(["common", "screens"]);

  /**
   * Change a boolean behaviour setting
   *
   * @param key   - Behaviour setting key
   * @param value - Behaviour value
   */
  const onBooleanChange = (key: keyof AppBehaviours, value: boolean) => {
    dispatch(
      setAppBehaviour({
        [key]: value,
      }),
    );
  };

  return (
    <Page>
      <AppBar title={t("screens:settingsBehaviours.title")} />
      <ScrollView contentContainerStyle={styles.pageContent}>
        <BehavioursScreenListItemSwitch
          description={t("screens:settingsBehaviours.behaviourItemConfirmSharedDaysDescription")}
          stateKey="confirmSharedDays"
          title={t("screens:settingsBehaviours.behaviourItemConfirmSharedDaysTitle")}
          value={appBehaviours.confirmSharedDays}
          onChange={onBooleanChange}
        />
        <BehavioursScreenListItemSwitch
          description={t("screens:settingsBehaviours.behaviourItemSwapDetailsThemeDescription")}
          stateKey="swapThemeOnDetails"
          title={t("screens:settingsBehaviours.behaviourItemSwapDetailsThemeTitle")}
          value={appBehaviours.swapThemeOnDetails}
          onChange={onBooleanChange}
        />
        <BehavioursScreenListItemSwitch
          description={t(
            "screens:settingsBehaviours.behaviourItemIncludeTagsInIconSearchDescription",
          )}
          stateKey="includeTagsInIconSearch"
          title={t("screens:settingsBehaviours.behaviourItemIncludeTagsInIconSearchTitle")}
          value={appBehaviours.includeTagsInIconSearch}
          onChange={onBooleanChange}
        />
      </ScrollView>
    </Page>
  );
};

const styles = StyleSheet.create({
  pageContent: {
    flexGrow: 1,
  },
});

export default BehavioursScreen;
