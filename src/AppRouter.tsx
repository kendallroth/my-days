import React, { ReactElement } from "react";
import { useTheme } from "react-native-paper";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

// Components
import { HomeScreen } from "@screens/Home";
import { SettingsRouter } from "@screens/Settings";

export type RootRouterParams = {
  HomeScreen: undefined;
  SettingsRouter: undefined;
};

export type RootRouterNavigation = NativeStackNavigationProp<RootRouterParams>;

const Stack = createNativeStackNavigator<RootRouterParams>();

const AppRouter = (): ReactElement => {
  const { colors } = useTheme();

  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.background,
      text: colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen component={HomeScreen} name="HomeScreen" />
        <Stack.Screen component={SettingsRouter} name="SettingsRouter" />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppRouter;
