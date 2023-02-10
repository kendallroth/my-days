import { useAppTheme } from "@hooks";
import { darkTheme, lightTheme } from "@styles/theme";

export interface SwapTheme {
  /** Input (regular) theme */
  baseTheme: ReturnType<typeof useAppTheme>;
  /** Potentially swapped theme */
  outputTheme: ReturnType<typeof useAppTheme>;
  /** Whether theme has been swapped */
  swapped?: boolean;
}

/** Potentially flip theme based on option */
export const useSwapTheme = (swap: boolean): SwapTheme => {
  const baseTheme = useAppTheme();

  const maybeSwappedDark = swap ? !baseTheme.dark : baseTheme.dark;
  const outputTheme = maybeSwappedDark ? darkTheme : lightTheme;

  return {
    baseTheme,
    swapped: swap,
    outputTheme,
  };
};
