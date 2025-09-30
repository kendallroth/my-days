// Shim for replacing missing 'getRandomValues' with 'expo-crypto'
import "./utilities/expo-random-shim";

import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { enableScreens } from "react-native-screens";
import { Provider as ReduxProvider } from "react-redux";
// TODO: Not sure if important or not? Remove it along with upgrading react-native-modal seemed to fix bug with back???
// import "react-native-gesture-handler";
import { setLocale as setYupLocale } from "yup";

import { TheAppDataLoader } from "@components/single";
import ContextProvider from "@contexts/ContextProvider";
import { useAppSelector } from "@hooks";
import { SettingsService } from "@services";
import setupStore from "@store";
import { selectThemeConfig } from "@store/slices/settings";
import { darkTheme, lightTheme } from "@styles/theme";
import { AppTheme } from "@typings/settings.types";

import AppRouter from "./AppRouter";
import { yupLocale } from "./localization/yup-locale";

import "./localization/config";

// NOTE: Optimize React Navigation memory usage/performance?
// Source: https://reactnavigation.org/docs/react-native-screens/
enableScreens();

// Support a custom locale dictionary for validation messages
// Source: https://github.com/jquense/yup#using-a-custom-locale-dictionary
setYupLocale(yupLocale);

const { persistor, store } = setupStore();

/** Wrapped component to be able to access Redux store */
const AppWrapped = () => {
  const themeConfig = useAppSelector(selectThemeConfig);

  const themeType: AppTheme =
    themeConfig.code === AppTheme.AUTO ? SettingsService.getDeviceTheme() : themeConfig.code;

  const componentTheme = themeType === AppTheme.DARK ? darkTheme : lightTheme;
  // NOTE: Status bar color is overridden in each page to ensure proper match with header and theme
  const statusTheme = themeType === AppTheme.DARK ? "light" : "dark";

  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={componentTheme}>
        <ContextProvider>
          {/* NOTE: Children are not rendered until app is fully loaded! */}
          <TheAppDataLoader persistor={persistor}>
            <View style={styles.app}>
              <StatusBar style={statusTheme} />
              <NavigationContainer>
                <AppRouter />
              </NavigationContainer>
            </View>
          </TheAppDataLoader>
        </ContextProvider>
      </PaperProvider>
    </ReduxProvider>
  );
};

const App = () => (
  <ReduxProvider store={store}>
    <AppWrapped />
  </ReduxProvider>
);

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
});

export default App;
