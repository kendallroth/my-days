import { type NavigatorScreenParams, useNavigation } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import React from "react";

import { useAppSelector } from "@hooks";
import { DayFormScreen } from "@screens/DayForm";
import { DetailsScreen } from "@screens/Details";
import { HomeScreen } from "@screens/Home";
import { SettingsRouter } from "@screens/Settings";
import { type SettingsRouterParams } from "@screens/Settings/SettingsRouter";
import { selectStartOpenDay } from "@store/slices/days";
import { type Day } from "@typings/day.types";

import { useAppOpenLink } from "./app-link.hook";
import { useMounted } from "./hooks/useMounted";

export type RootRouterParams = {
  DayFormScreen: {
    /** Day to update (if editing) */
    day: Day | null;
  };
  DetailsScreen: {
    /** Selected day ID */
    dayId: string;
  };
  HomeScreen:
    | {
        /** Shared day parsed from external link  */
        sharedDay?: Day;
      }
    | undefined;
  SettingsRouter: NavigatorScreenParams<SettingsRouterParams> | undefined;
};

export type RootRouterNavigation = NativeStackNavigationProp<RootRouterParams>;

const Stack = createNativeStackNavigator<RootRouterParams>();

const AppRouter = () => {
  // TODO: Investigate adapting React Navigation theme to use MD3 colors
  // Source: https://callstack.github.io/react-native-paper/theming.html

  useAppOpenLink();

  const startDay = useAppSelector(selectStartOpenDay);
  const navigation = useNavigation<RootRouterNavigation>();

  // Immediately open selected day when app mounts (if selected)
  // NOTE: This should only happen once! If router somehow remounts, consider using Redux to limit once.
  useMounted(() => {
    if (!startDay) return;

    navigation.navigate("DetailsScreen", { dayId: startDay.id });
  });

  // NOTE: Main 'NavigationContainer' is rendered by parent to allow accessing router here
  return (
    <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen component={HomeScreen} name="HomeScreen" />
      <Stack.Screen component={DetailsScreen} name="DetailsScreen" />
      <Stack.Screen component={DayFormScreen} name="DayFormScreen" />
      <Stack.Screen component={SettingsRouter} name="SettingsRouter" />
    </Stack.Navigator>
  );
};

export default AppRouter;
