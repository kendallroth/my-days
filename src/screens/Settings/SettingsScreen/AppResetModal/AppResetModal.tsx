import React, { forwardRef, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Button, Checkbox, useTheme } from "react-native-paper";

import { BottomSheet } from "@components/dialogs";

import type { BottomSheetRef } from "@components/dialogs/BottomSheet";
import type { IAppResetOptions } from "@typings/settings.types";

type AppResetModalProps = {
  /** App reset handler */
  onReset: (resetOptions: IAppResetOptions) => void;
};

type AppResetOptionKeys = keyof IAppResetOptions;

const initialOptions: IAppResetOptions = {
  days: false,
  settings: false,
};

const AppResetModal = forwardRef<BottomSheetRef, AppResetModalProps>(
  (props: AppResetModalProps, ref): ReactElement => {
    const { onReset } = props;

    const [resetOptions, setResetOptions] = useState<IAppResetOptions>(initialOptions);

    const { t } = useTranslation(["screens"]);
    const { colors } = useTheme();

    const resetOptionsMap: Record<AppResetOptionKeys, string> = {
      days: t("screens:settingsAppReset.listItemDays"),
      settings: t("screens:settingsAppReset.listItemSettings"),
    };

    const resetOptionList = Object.keys(resetOptionsMap) as AppResetOptionKeys[]; // prettier-ignore
    const hasSelection = Object.values(resetOptions).some((o) => o === true);

    /**
     * Reset the modal when opening
     */
    const onModalOpen = () => {
      setResetOptions(initialOptions);
    };

    /**
     * Toggle selected reset options
     *
     * @param key - Selected reset option
     */
    const onOptionPress = (key: AppResetOptionKeys): void => {
      const newOptions: IAppResetOptions = {
        ...resetOptions,
        [key]: !resetOptions[key],
      };

      setResetOptions({ ...newOptions });
    };

    return (
      <BottomSheet
        ref={ref}
        dismissable
        inset={false}
        title={t("screens:settingsAppReset.title")}
        onOpen={onModalOpen}
      >
        <View style={styles.listItems}>
          {resetOptionList.map(
            (option): ReactElement => (
              <Checkbox.Item
                key={option}
                label={resetOptionsMap[option]}
                status={resetOptions[option] ? "checked" : "unchecked"}
                onPress={() => onOptionPress(option)}
              />
            ),
          )}
        </View>
        <Button
          color={colors.error}
          disabled={!hasSelection}
          style={styles.actionConfirm}
          onPress={() => onReset(resetOptions)}
        >
          {t("screens:settingsAppReset.actionSubmit")}
        </Button>
      </BottomSheet>
    );
  },
);

const styles = StyleSheet.create({
  listItems: {},
  actionConfirm: {
    marginTop: 16,
    alignSelf: "center",
  },
});

export default AppResetModal;
