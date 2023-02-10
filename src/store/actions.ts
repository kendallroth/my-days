import { createAction } from "@reduxjs/toolkit";

import { type AppPopulateOptions, type AppResetOptions } from "@typings/settings.types";

/** DEBUG: Action to add dummy data */
const addDebugDataAction = createAction<AppPopulateOptions>("addDebugData");

/** Reset parts of the app data */
const resetAppAction = createAction<AppResetOptions>("resetApp");

export { addDebugDataAction, resetAppAction };
