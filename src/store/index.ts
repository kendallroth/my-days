import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import i18n from "i18next";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { type Persistor } from "redux-persist/es/types";

import config from "@config";

import { migrations } from "./migrations";
import reducers from "./reducers";

interface StoreExport {
  persistor: Persistor;
  store: typeof store;
}

// NOTE: Cannot type with 'PersistConfig' as it either introduces a TS circular dependency, since
//         the type is directly derived from the compiled Redux state or removes types altogether.
const persistConfig = {
  // Enable separately persisted Redux stores per release channel
  key: `store_${config.build.releaseChannel}`,
  migrate: migrations,
  storage: AsyncStorage,
  version: 1,
  whitelist: ["days", "settings"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore serialization issues caused by redux-persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  reducer: persistedReducer,
});

/**
 * Setup Redux store and configure persistance
 *
 * @returns Redux store and persistance
 */
const setupStore = (): StoreExport => {
  const persistor = persistStore(store, null, () => {
    // NOTE: Language is loaded when store is rehydrated from async storage
    const language = store.getState().settings.language;
    i18n.changeLanguage(language);
  });

  // @ts-ignore
  if (process.env.NODE_ENV !== "production" && module.hot) {
    // Source: https://github.com/rt2zz/redux-persist/blob/master/docs/hot-module-replacement.md
    // @ts-ignore
    module.hot.accept("./reducers", () => {
      const nextReducer = require("./reducers").default;
      store.replaceReducer(persistReducer(persistConfig, nextReducer));
    });
  }

  return { persistor, store };
};

export default setupStore;
export { store };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
