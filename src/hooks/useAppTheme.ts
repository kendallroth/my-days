import { useTheme } from "react-native-paper";

import { lightTheme } from "@styles/theme";

export type AppTheme = typeof lightTheme;

export const useAppTheme = () => useTheme<AppTheme>();
