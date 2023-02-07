import { useContext } from "react";

import { AppLoaderContext, type IAppLoaderContext } from "@contexts/AppLoaderContext";

/**
 * Expose app loading manager context as hook
 *
 * @returns {Object} App loader manager
 */
const useAppLoader = (): IAppLoaderContext => useContext(AppLoaderContext);

export { useAppLoader };
