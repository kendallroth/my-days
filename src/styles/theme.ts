import {
  configureFonts,
  MD3DarkTheme as DarkTheme,
  MD3LightTheme as LightTheme,
} from "react-native-paper";
import { type MD3Type } from "react-native-paper/lib/typescript/types";

// NOTE: Base colour used to generate theme
// const colorPrimary = "#004d7d";

const fontConfig: Record<string, Partial<MD3Type>> = {
  // TODO: Increase font weight for labels
  bodySmall: {
    fontSize: 14,
  },
  bodyMedium: {
    fontSize: 16,
  },
  bodyLarge: {
    fontSize: 18,
  },
  titleSmall: {
    fontWeight: "700",
  },
  titleMedium: {
    fontWeight: "700",
  },
  titleLarge: {
    fontWeight: "700",
  },
};

const fontTheme = configureFonts({ config: fontConfig });

// TODO: Consider copying in custom color generation code for theme colors
// Source: https://github.com/callstack/react-native-paper/blob/main/docs/pages/src/utils/createDynamicColorTheme.js
// Source: https://github.com/material-foundation/material-color-utilities

// Generated at: https://callstack.github.io/react-native-paper/theming.html
const customLightColors = {
  primary: "rgb(0, 98, 158)",
  onPrimary: "rgb(255, 255, 255)",
  primaryContainer: "rgb(207, 229, 255)",
  onPrimaryContainer: "rgb(0, 29, 52)",
  secondary: "rgb(82, 96, 112)",
  onSecondary: "rgb(255, 255, 255)",
  secondaryContainer: "rgb(213, 228, 247)",
  onSecondaryContainer: "rgb(15, 29, 42)",
  tertiary: "rgb(105, 87, 121)",
  onTertiary: "rgb(255, 255, 255)",
  tertiaryContainer: "rgb(240, 219, 255)",
  onTertiaryContainer: "rgb(36, 21, 50)",
  error: "rgb(186, 26, 26)",
  onError: "rgb(255, 255, 255)",
  errorContainer: "rgb(255, 218, 214)",
  onErrorContainer: "rgb(65, 0, 2)",
  background: "rgb(252, 252, 255)",
  onBackground: "rgb(26, 28, 30)",
  surface: "rgb(252, 252, 255)",
  onSurface: "rgb(26, 28, 30)",
  surfaceVariant: "rgb(222, 227, 235)",
  onSurfaceVariant: "rgb(66, 71, 78)",
  outline: "rgb(114, 119, 127)",
  outlineVariant: "rgb(194, 199, 207)",
  shadow: "rgb(0, 0, 0)",
  scrim: "rgb(0, 0, 0)",
  inverseSurface: "rgb(47, 48, 51)",
  inverseOnSurface: "rgb(241, 240, 244)",
  inversePrimary: "rgb(153, 203, 255)",
  elevation: {
    level0: "transparent",
    level1: "rgb(239, 244, 250)",
    level2: "rgb(232, 240, 247)",
    level3: "rgb(224, 235, 244)",
    level4: "rgb(222, 234, 243)",
    level5: "rgb(217, 230, 241)",
  },
  surfaceDisabled: "rgba(26, 28, 30, 0.12)",
  onSurfaceDisabled: "rgba(26, 28, 30, 0.38)",
  backdrop: "rgba(44, 49, 55, 0.4)",
};

const customDarkColors = {
  primary: "rgb(153, 203, 255)",
  onPrimary: "rgb(0, 51, 85)",
  primaryContainer: "rgb(0, 74, 120)",
  onPrimaryContainer: "rgb(207, 229, 255)",
  secondary: "rgb(186, 200, 218)",
  onSecondary: "rgb(36, 50, 64)",
  secondaryContainer: "rgb(58, 72, 87)",
  onSecondaryContainer: "rgb(213, 228, 247)",
  tertiary: "rgb(212, 190, 230)",
  onTertiary: "rgb(57, 42, 73)",
  tertiaryContainer: "rgb(80, 64, 96)",
  onTertiaryContainer: "rgb(240, 219, 255)",
  error: "rgb(255, 180, 171)",
  onError: "rgb(105, 0, 5)",
  errorContainer: "rgb(147, 0, 10)",
  onErrorContainer: "rgb(255, 180, 171)",
  background: "rgb(26, 28, 30)",
  onBackground: "rgb(226, 226, 229)",
  surface: "rgb(26, 28, 30)",
  onSurface: "rgb(226, 226, 229)",
  surfaceVariant: "rgb(66, 71, 78)",
  onSurfaceVariant: "rgb(194, 199, 207)",
  outline: "rgb(140, 145, 153)",
  outlineVariant: "rgb(66, 71, 78)",
  shadow: "rgb(0, 0, 0)",
  scrim: "rgb(0, 0, 0)",
  inverseSurface: "rgb(226, 226, 229)",
  inverseOnSurface: "rgb(47, 48, 51)",
  inversePrimary: "rgb(0, 98, 158)",
  elevation: {
    level0: "transparent",
    level1: "rgb(32, 37, 41)",
    level2: "rgb(36, 42, 48)",
    level3: "rgb(40, 47, 55)",
    level4: "rgb(41, 49, 57)",
    level5: "rgb(44, 53, 62)",
  },
  surfaceDisabled: "rgba(226, 226, 229, 0.12)",
  onSurfaceDisabled: "rgba(226, 226, 229, 0.38)",
  backdrop: "rgba(44, 49, 55, 0.4)",
};

/** Shared theme colors (typically literals) */
const sharedColors = {
  black: "#000000",
  transparent: "transparent",
  white: "#ffffff",
};

// TODO: Fix warning colors (had to reverse light/dark from MD3 tool???)

/** Light theme colors */
const lightColors = {
  ...LightTheme.colors,
  ...customLightColors,
  warning: "#ffbb01",
  onWarning: "#412d00",
  warningContainer: "#5d4200",
  onWarningContainer: "#ffdea5",
};

/** Dark theme colors */
const darkColors = {
  ...DarkTheme.colors,
  ...customDarkColors,
  warning: "#7b5800",
  onWarning: "#ffffff",
  warningContainer: "#ffdea5",
  onWarningContainer: "#261900",
};

const darkTheme = {
  ...DarkTheme,
  colors: darkColors,
  fonts: fontTheme,
};

const lightTheme = {
  ...LightTheme,
  colors: lightColors,
  fonts: fontTheme,
};

export { darkColors, darkTheme, lightColors, lightTheme, sharedColors };
