import "dayjs/locale/es";
import "intl-pluralrules";
import dayjs from "dayjs";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { AppLanguage } from "@typings/settings.types";

import enCommon from "./en/common.json";
import enScreens from "./en/screens.json";
import esCommon from "./es/common.json";
import esScreens from "./es/screens.json";
import languageDetector from "./language-detector";

export const defaultNamespace = "common";
export const resources = {
  en: {
    common: enCommon,
    screens: enScreens,
  },
  es: {
    common: esCommon,
    screens: esScreens,
  },
} as const;

// NOTE: 'intl-pluralrules' was installed as a pluralization polyfill (for i18next 21+)
i18n
  .use(initReactI18next)
  .use(languageDetector)
  .init({
    defaultNS: defaultNamespace,
    fallbackLng: AppLanguage.ENGLISH,
    interpolation: {
      // NOTE: Not needed for React!
      escapeValue: false,
      format: (value, format, language) => {
        if (dayjs.isDayjs(value)) {
          return value.locale(language ?? "en").format(format);
        }

        return value;
      },
    },
    resources,
  });
