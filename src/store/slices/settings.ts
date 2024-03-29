import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import i18n from "i18next";

import { SettingsService } from "@services";
import {
  type AppBehaviours,
  type AppLanguage,
  type AppLanguageConfig,
  type AppPopulateOptions,
  type AppResetOptions,
  type AppTheme,
  type AppThemeConfig,
} from "@typings/settings.types";
import { LANGUAGES, THEMES } from "@utilities/constants";

import { type RootState } from "..";
import { addDebugDataAction, resetAppAction } from "../actions";

interface SettingsState {
  /** App behaviour settings */
  behaviours: AppBehaviours;
  /** Whether app is in development mode */
  developer: boolean;
  /** App language (for internationalization) */
  language: AppLanguage;
  /** App theme */
  theme: AppTheme;
}

////////////////////////////////////////////////////////////////////////////////
// Slice
////////////////////////////////////////////////////////////////////////////////

// Provide some basic defaults until app settings are loaded
const initialState: SettingsState = {
  behaviours: {
    confirmSharedDays: true,
    includeTagsInIconSearch: true,
    swapThemeOnDetails: true,
  },
  developer: false,
  language: SettingsService.getDeviceLanguage(),
  theme: SettingsService.getDeviceTheme(),
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setAppBehaviour: (state, action: PayloadAction<Partial<AppBehaviours>>) => {
      state.behaviours = {
        ...state.behaviours,
        ...action.payload,
      };
    },
    setAppDeveloper: (state, action: PayloadAction<boolean>) => {
      state.developer = action.payload;
    },
    setAppLanguage: (state, action: PayloadAction<AppLanguage>) => {
      state.language = action.payload;
    },
    setAppTheme: (state, action: PayloadAction<AppTheme>) => {
      state.theme = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetAppAction, (state, action) => {
      if (!action.payload.settings) return;

      state.behaviours = initialState.behaviours;
      state.language = initialState.language;
      state.theme = initialState.theme;
    });
  },
});

////////////////////////////////////////////////////////////////////////////////
// Thunks
////////////////////////////////////////////////////////////////////////////////

// Add debug data to the store
const addDebugDataThunk = createAsyncThunk(
  "settings/addDebugData",
  async (options: AppPopulateOptions, { dispatch }) => {
    // NOTE: Delay the action to make it feel that something is happening
    await new Promise((resolve) => setTimeout(resolve, 1000));

    dispatch(addDebugDataAction(options));
  },
);

// Reset the store state
const resetAppThunk = createAsyncThunk(
  "settings/resetApp",
  async (options: AppResetOptions, { dispatch }) => {
    // NOTE: Delay the action to make it feel that something is happening
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (options.settings) {
      // Change language in localization context
      i18n.changeLanguage(initialState.language);
    }

    dispatch(resetAppAction(options));
  },
);

////////////////////////////////////////////////////////////////////////////////
// Selectors
////////////////////////////////////////////////////////////////////////////////

export const selectBehaviours = (state: RootState): AppBehaviours => state.settings.behaviours;
export const selectDeveloperMode = (state: RootState): boolean => state.settings.developer;
export const selectLanguage = (state: RootState): AppLanguage => state.settings.language;
export const selectLanguageConfig = (state: RootState): AppLanguageConfig =>
  LANGUAGES[state.settings.language];
export const selectThemeConfig = (state: RootState): AppThemeConfig => THEMES[state.settings.theme];

export { addDebugDataThunk, resetAppThunk };
export const { setAppBehaviour, setAppDeveloper, setAppLanguage, setAppTheme } =
  settingsSlice.actions;

export default settingsSlice.reducer;
