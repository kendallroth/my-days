import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet } from "react-native";

import { AppBar, Page } from "@components/layout";
import { useAppDispatch, useAppSelector } from "@hooks";
import { selectBehaviours, setAppBehaviour } from "@store/slices/settings";
import { type IAppBehaviours } from "@typings/settings.types";

import BehavioursScreenListItemSwitch from "./BehavioursScreenListItemSwitch";

const BehavioursScreen = (): ReactElement => {
  const dispatch = useAppDispatch();
  const appBehaviours = useAppSelector(selectBehaviours);
  const { t } = useTranslation(["common", "screens"]);

  /**
   * Change a boolean behaviour setting
   *
   * @param key   - Behaviour setting key
   * @param value - Behaviour value
   */
  const onBooleanChange = (key: keyof IAppBehaviours, value: boolean): void => {
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
          // TODO: Remove type-checking skip!
          // @ts-ignore
          stateKey=""
          title={t("common:errors.notImplemented")}
          value={false}
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
