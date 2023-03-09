import "dayjs/locale/es";

// Required formatting polyfills for Intl API (used by 'react-i18n')
// Source: https://www.i18next.com/translation-function/formatting
import "@formatjs/intl-getcanonicallocales/polyfill";
import "@formatjs/intl-locale/polyfill";
import "@formatjs/intl-pluralrules/polyfill";
import "@formatjs/intl-pluralrules/locale-data/en";
import "@formatjs/intl-pluralrules/locale-data/es";
import "@formatjs/intl-numberformat/polyfill";
import "@formatjs/intl-numberformat/locale-data/en";
import "@formatjs/intl-numberformat/locale-data/es";

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

i18n
  .use(initReactI18next)
  .use(languageDetector)
  .init({
    defaultNS: defaultNamespace,
    fallbackLng: AppLanguage.ENGLISH,
    interpolation: {
      // NOTE: Not needed for React!
      escapeValue: false,
      // NOTE: Apparently a legacy way of formatting that prevents using the built-in formatting
      //         function that are based on Intl API (have handled numbers and dates though).
      // Source: https://www.i18next.com/translation-function/formatting#legacy-format-function-i18next-less-than-21.3.0
      format: (value, format, language, options) => {
        if (dayjs.isDayjs(value)) {
          return value.locale(language ?? "en").format(format);
        }
        // Numeric formatting passes additional options to 'toLocaleString'
        else if (format === "number") {
          const number = parseFloat(value);
          if (isNaN(number)) return value;

          return number.toLocaleString(language, options as any);
        }

        return value;
      },
    },
    resources,
  });
