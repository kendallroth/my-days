/*
 * Shim for apparent regression in Expo 48 that no longer supports the same API from 'expo-random',
 *   which causes issues with 'react-native-get-random-values'. This may eventually be fixed, but
 *   until then is necessary to continue to work with 'uuid' library.
 *
 * Source: https://github.com/expo/expo/issues/17270#issuecomment-1445149952
 */

import { getRandomValues as expoCryptoGetRandomValues } from "expo-crypto";

class Crypto {
  getRandomValues = expoCryptoGetRandomValues;
}

const webCrypto = typeof crypto !== "undefined" ? crypto : new Crypto();

(() => {
  if (typeof crypto === "undefined") {
    Object.defineProperty(window, "crypto", {
      configurable: true,
      enumerable: true,
      get: () => webCrypto,
    });
  }
})();
