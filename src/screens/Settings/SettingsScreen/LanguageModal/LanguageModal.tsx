import React, { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { List } from "react-native-paper";

import { BottomSheet } from "@components/dialogs";
import { type BottomSheetRef } from "@components/dialogs/BottomSheet";
import { LanguageIcon } from "@components/icons";
import { type AppLanguage } from "@typings/settings.types";
import { LANGUAGES } from "@utilities/constants";

import SettingsModalListItem from "../SettingsModalListItem";

type LanguageModalProps = {
  /** Current language */
  language: AppLanguage;
  /** Selection handler */
  onSelect: (language: AppLanguage) => void;
};

const LanguageModal = forwardRef<BottomSheetRef, LanguageModalProps>(
  (props: LanguageModalProps, ref) => {
    const { language: currentLanguage, onSelect } = props;

    const { t } = useTranslation(["common", "screens"]);

    const languages = Object.values(LANGUAGES);
    const betaPhrase = ` (${t("common:phrases.beta")})`;

    return (
      <BottomSheet ref={ref} dismissable inset={false} title={t("screens:settingsLanguage.title")}>
        {languages.map((language) => (
          <SettingsModalListItem
            key={language.code}
            disabled={language.disabled}
            left={(leftProps: any) => (
              <List.Icon
                {...leftProps}
                icon={({ size }) => (
                  <LanguageIcon
                    beta={language.beta}
                    flag={language.flag}
                    selected={currentLanguage === language.code}
                    size={size * 1.25}
                    // Move icon to right to compensate for increased size
                    style={{ marginLeft: size * 1.25 - size }}
                  />
                )}
              />
            )}
            title={`${language.title}${language.beta ? betaPhrase : ""}`}
            selected={currentLanguage === language.code}
            onPress={() => onSelect(language.code)}
          />
        ))}
      </BottomSheet>
    );
  },
);

const styles = StyleSheet.create({});

export default LanguageModal;
