import { NavigatorScreenParams } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import React, { ReactElement } from "react";

import { HomeScreen } from "@screens/Home";
import { SettingsRouter } from "@screens/Settings";
import { type SettingsRouterParams } from "@screens/Settings/SettingsRouter";

import { useAppOpenLink } from "./app-link.hook";

export type RootRouterParams = {
  HomeScreen: undefined;
  SettingsRouter: NavigatorScreenParams<SettingsRouterParams> | undefined;
};

export type RootRouterNavigation = NativeStackNavigationProp<RootRouterParams>;

const Stack = createNativeStackNavigator<RootRouterParams>();

const AppRouter = (): ReactElement => {
  // TODO: Investigate adapting React Navigation theme to use MD3 colors
  // Source: https://callstack.github.io/react-native-paper/theming.html

  useAppOpenLink();

  // NOTE: Main 'NavigationContainer' is rendered by parent to allow accessing router here
  return (
    <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen component={HomeScreen} name="HomeScreen" />
      <Stack.Screen component={SettingsRouter} name="SettingsRouter" />
    </Stack.Navigator>
  );
};

export default AppRouter;
