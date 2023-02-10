import React from "react";
import { Provider as PaperProvider } from "react-native-paper";

import { useAppSelector, useAppTheme } from "@hooks";
import { selectBehaviours } from "@store/slices/settings";
import { darkTheme, lightTheme } from "@styles/theme";

import DetailsScreen from "./DetailsScreen";

const DetailsScreenTheme = () => {
  const appBehaviours = useAppSelector(selectBehaviours);
  const { dark } = useAppTheme();

  // Optionally swap the dark/light theme on the Details page (due to colouring) of preferred by user
  const maybeSwappedDark = appBehaviours.swapThemeOnDetails ? !dark : dark;
  const componentTheme = maybeSwappedDark ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={componentTheme}>
      <DetailsScreen />
    </PaperProvider>
  );
};

export default DetailsScreenTheme;
