import React, { type ReactNode } from "react";
import { ThemeProvider } from "react-native-paper";

import { useAppSelector, useSwapTheme } from "@hooks";
import { selectBehaviours } from "@store/slices/settings";

interface SwapDetailsThemeProps {
  children: ReactNode;
}

/** Potentially flip theme based on app behaviour option */
const SwapDetailsTheme = (props: SwapDetailsThemeProps) => {
  const { children } = props;

  const appBehaviours = useAppSelector(selectBehaviours);
  const { outputTheme } = useSwapTheme(appBehaviours.swapThemeOnDetails);

  // @ts-expect-error check @callstack/react-theme-provider's children prop
  return <ThemeProvider theme={outputTheme}>{children}</ThemeProvider>;
};

export default SwapDetailsTheme;
