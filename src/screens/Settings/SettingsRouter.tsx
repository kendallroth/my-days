import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import React from "react";

import { AboutScreen } from "./AboutScreen";
import { BehavioursScreen } from "./BehavioursScreen";
import { ContributorsScreen } from "./ContributorsScreen";
import { DeveloperScreen } from "./DeveloperScreen";
import { ReportBugScreen } from "./ReportBug";
import { SettingsScreen } from "./SettingsScreen";

export type SettingsRouterParams = {
  About: undefined;
  Behaviours: undefined;
  Contributors: undefined;
  Developer: undefined;
  ReportBug: undefined;
  Settings: undefined;
};

export type SettingsRouterNavigation = NativeStackNavigationProp<SettingsRouterParams>;

const Stack = createNativeStackNavigator<SettingsRouterParams>();

const SettingsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={SettingsScreen} name="Settings" />
      <Stack.Screen component={AboutScreen} name="About" />
      <Stack.Screen component={BehavioursScreen} name="Behaviours" />
      <Stack.Screen component={ContributorsScreen} name="Contributors" />
      <Stack.Screen component={DeveloperScreen} name="Developer" />
      <Stack.Screen component={ReportBugScreen} name="ReportBug" />
    </Stack.Navigator>
  );
};

export default SettingsStack;
