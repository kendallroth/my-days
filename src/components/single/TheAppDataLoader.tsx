/*
 * Component to keep splash screen visible until vital data is loaded.
 *
 * Adapted from: https://github.com/rt2zz/redux-persist/blob/master/src/integration/react.js
 */

import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { type Persistor, type PersistorSubscribeCallback } from "redux-persist/es/types";

import type React from "react";

type AppDataLoaderProps = {
  children: React.ReactElement;
  /** Redux persistor */
  persistor: Persistor;
};

// Prevent hiding the splash screen automatically (ignore errors)
SplashScreen.preventAutoHideAsync();

/**
 * Data Loader to keep splash screen until important data is loaded
 */
const AppDataLoader = (props: AppDataLoaderProps): React.ReactElement | null => {
  const { children, persistor } = props;

  // NOTE: Need to track Redux Persist loading status separately!
  const [isAppReady, setIsAppReady] = useState(false);
  const [isReduxReady, setIsReduxReady] = useState(false);

  // Load persisted Redux data into store
  useEffect(() => {
    const unsubscribe = persistor.subscribe(handlePersistor as PersistorSubscribeCallback);

    handlePersistor(unsubscribe);

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load/cache appropriate app data (Redux is separate)
  // TODO: Eventually follow this guide more closely (if using Redux?)
  //         https://docs.expo.io/versions/latest/sdk/splash-screen/
  useEffect(() => {
    const prepare = async (): Promise<void> => {
      try {
        // TODO: Load any required assets, etc
      } catch {
        // TODO: Handle errors...
      } finally {
        setIsAppReady(true);
      }
    };

    prepare();
  }, []);

  /**
   * Redux Persistor callback
   *
   * @param {function} unsubscribe - Persistor watch unsubscribe function
   */
  const handlePersistor = (unsubscribe: () => void) => {
    const { bootstrapped } = persistor.getState();
    if (!bootstrapped) return;

    // NOTE: Brief delay is necessary to fully update app state immediately after
    //         rehydration (language, etc), BEFORE letting app render!
    setTimeout(() => {
      setIsReduxReady(true);
    }, 10);

    unsubscribe && unsubscribe();
  };

  // Only hide the splash screen once data is fully loaded; otherwise there
  //   will be a brief flash of the loading screen!
  useEffect(() => {
    if (!isAppReady || !isReduxReady) return;

    // Briefly pause before hiding splash screen to let components fully render. Unfortunately this
    //   cannot be applied via 'onReady' in the root NavigationContainer as it does not seem to
    //   properly wait currently (still has a flicker).
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 10);
  }, [isAppReady, isReduxReady]);

  if (!isAppReady || !isReduxReady) return null;

  return children;
};

export default AppDataLoader;
