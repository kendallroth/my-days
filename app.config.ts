import { ExpoConfig } from "@expo/config";

import { version } from "./package.json";

const primaryColor = "#004d7d";

/**
 * Semantic version name (viewable)
 *
 * Android - 'versionName'
 * iOS     - 'CFBundleShortVersionString'
 */
const versionName = version;
/**
 * Android build code (increment with each submitted build)
 */
const androidVersionCode = 1;
/**
 * iOS semantic build code (increment with each submitted build)
 *
 * NOTE: Different from Android version code in that it may be reset
 *         with each version change; however, this is deemed confusing!
 */
const iosBuildNumber = 1;

export default (): ExpoConfig => ({
  // Information
  name: "My Days",
  slug: "my-days",
  version: versionName,
  owner: "kendallroth",
  orientation: "portrait",
  platforms: ["android", "ios"],
  entryPoint: "index.js",

  jsEngine: "hermes",

  // Theme
  icon: "./assets/icon.png",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "cover",
    backgroundColor: primaryColor,
  },

  assetBundlePatterns: ["**/*"],

  // Android overrides
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/android_launcher.png",
      backgroundColor: primaryColor,
    },
    package: "ca.kendallroth.my_days",
    permissions: [],
    versionCode: androidVersionCode,
  },
  androidNavigationBar: {
    barStyle: "light-content",
  },

  // iOS overrides
  ios: {
    buildNumber: `${iosBuildNumber}`,
    bundleIdentifier: "ca.kendallroth.my-days",
    // Icon must be 1024x1024 (no transparency)
    icon: "./assets/icon.png",
    supportsTablet: false,
  },

  // Deployment
  extra: {
    eas: {
      projectId: "0f596901-0769-4dcf-af51-73106137d331",
    },
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: "https://u.expo.dev/0f596901-0769-4dcf-af51-73106137d331",
  },
  runtimeVersion: {
    // policy: "appVersion",
    policy: "sdkVersion",
  },
});
