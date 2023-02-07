import { NavigatorScreenParams } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import * as Linking from "expo-linking";
import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { CodedError } from "@errors";
import { HomeScreen } from "@screens/Home";
import { SettingsRouter } from "@screens/Settings";
import { store } from "@store";
import { addDay } from "@store/slices/days";
import { parseDay } from "@utilities/day-parse.util";

import { useSnackbar } from "./hooks/useSnackbar";
import { useAppDispatch } from "./hooks/useStore";

import type { SettingsRouterParams } from "@screens/Settings/SettingsRouter";

export type RootRouterParams = {
  HomeScreen: undefined;
  SettingsRouter: NavigatorScreenParams<SettingsRouterParams> | undefined;
};

export type RootRouterNavigation = NativeStackNavigationProp<RootRouterParams>;

const Stack = createNativeStackNavigator<RootRouterParams>();

const AppRouter = (): ReactElement => {
  // TODO: Investigate adapting React Navigation theme to use MD3 colors
  // Source: https://callstack.github.io/react-native-paper/theming.html

  const { notify, notifyError } = useSnackbar();
  const dispatch = useAppDispatch();
  const { t } = useTranslation(["screens"]);

  // Detect and handle external links used to open the app
  const linkedUrl = Linking.useURL();
  const [previousLink, setPreviousLink] = useState<string | null>(null);

  useEffect(() => {
    // Prevent needless re-runs by only triggering with changed exteral URL
    // TODO: Find better way of only running when app was previously unfocused and just received focus,
    //         as this yields strange behaviour (ignores?) when following the same link twice...
    if (!linkedUrl || linkedUrl === previousLink) return;

    const { path, queryParams } = Linking.parse(linkedUrl);
    if (!path || !queryParams) return;

    setPreviousLink(linkedUrl);

    if (path === "day/shared") {
      try {
        const day = parseDay(queryParams);

        const storeState = store.getState();
        if (storeState.days.entities[day.id]) {
          notifyError("Shared day was already added");
          return;
        }

        // TODO: Consider adding a confirmation dialog before blindly adding...
        dispatch(addDay(day));
        notify(t("screens:home.sharedDayAdded", { title: day.title }));

        // NOTE: Considered navigating to HomeScreen and pre-filling "Add Day" form, but discarded
        //         as it required more work to only happen once when linked and added little...
      } catch (e) {
        // Ignore errors and simply skip the linking attempt???
        let errorMessage = t("screens:home.sharedDayError");
        if (e instanceof CodedError) {
          // @ts-ignore
          errorMessage = t(e.message);
        } else {
          // eslint-disable-next-line no-console
          console.error("Error parsing linked day", e);
        }

        notifyError(errorMessage);
        return;
      }
    }
  }, [dispatch, notify, notifyError, linkedUrl, previousLink, t]);

  // NOTE: Main 'NavigationContainer' is rendered by parent to allow accessing router here
  return (
    <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen component={HomeScreen} name="HomeScreen" />
      <Stack.Screen component={SettingsRouter} name="SettingsRouter" />
    </Stack.Navigator>
  );
};

export default AppRouter;
