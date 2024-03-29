import { locale } from "expo-localization";
import { Appearance } from "react-native";

import { AppLanguage, AppTheme } from "@typings/settings.types";
import { validateEnum } from "@utilities/enum.util";

class SettingsService {
  /** Language defaults to English */
  DEFAULT_LANGUAGE = AppLanguage.ENGLISH;

  /**
   * Get device language
   *
   * NOTE: Only accepts/returns languages defined in 'AppLanguage'!
   */
  getDeviceLanguage(): AppLanguage {
    const localeString = locale?.split("-")[0];
    if (!localeString) return this.DEFAULT_LANGUAGE;

    const [, language] = validateEnum<AppLanguage>(
      AppLanguage,
      localeString,
      this.DEFAULT_LANGUAGE,
    );

    return language;
  }

  /** Get device theme */
  getDeviceTheme(): AppTheme {
    // NOTE: Apparently colour scheme can be 'null' (indicating no selection)
    const colorScheme = Appearance.getColorScheme();

    // No device theme will default to using light theme
    return colorScheme === "dark" ? AppTheme.DARK : AppTheme.LIGHT;
  }
}

const singleton = new SettingsService();
export default singleton;
