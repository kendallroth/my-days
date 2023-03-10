import { createMigrate, type MigrationManifest } from "redux-persist";

import { type RootState } from "@store";

const migrationConfigs: MigrationManifest = {
  // Included in v0.4.1
  //   - Initializes behaviour to include tags in icon search
  1: (state) => {
    const appState = state as RootState;
    appState.settings.behaviours.includeTagsInIconSearch = true;
    return appState;
  },
};

export const migrations = createMigrate(migrationConfigs);
