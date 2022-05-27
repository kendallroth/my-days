import { combineReducers } from "@reduxjs/toolkit";

// Utilities
import daysReducer from "./slices/days";
import settingsReducer from "./slices/settings";

const reducers = combineReducers({
  days: daysReducer,
  settings: settingsReducer,
});

export default reducers;
