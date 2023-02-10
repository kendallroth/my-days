import React, { type ReactNode } from "react";
import { ThemeProvider } from "react-native-paper";

import { useSwapTheme } from "@hooks";

export interface SwapThemeProps {
  children: ReactNode;
  /** Whether theme should be swapped in children */
  swap: boolean;
}

/** Potentially flip theme for a section of the app */
const SwapTheme = (props: SwapThemeProps) => {
  const { children, swap } = props;

  const { outputTheme } = useSwapTheme(swap);

  // @ts-expect-error check @callstack/react-theme-provider's children prop
  return <ThemeProvider theme={outputTheme}>{children}</ThemeProvider>;
};

export default SwapTheme;
