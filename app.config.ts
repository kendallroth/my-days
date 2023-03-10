// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ExpoConfig } from "@expo/config";

/**
 * App variant is used to support multiple installed variants of the app, utilizing
 *   a customized Package ID (Android) or Bundle ID (iOS) for development builds.
 *
 * @source https://docs.expo.dev/build-reference/variants/
 */
const appVariant = process.env.APP_VARIANT;
let appVariantAppIdSuffix = "";
let appVariantNameSuffix = "";
let appVariantSchemeSuffix = "";
if (appVariant === "development") {
  appVariantAppIdSuffix = ".dev";
  appVariantNameSuffix = " (dev)";
  appVariantSchemeSuffix = "-dev";
} else if (appVariant === "preview") {
  appVariantAppIdSuffix = ".preview";
  appVariantNameSuffix = " (preview)";
  appVariantSchemeSuffix = "-preview";
}

// Light variation of the "technical" primary colour, but matching the actual "primary" light theme color.
const lightenedPrimaryColor = "#00629E";

/**
 * Semantic version name (viewable)
 *
 * Android - 'versionName'
 * iOS     - 'CFBundleShortVersionString'
 */
const versionName = "0.4.0";
/**
 * Android build code (must increment with each submitted build)
 */
const androidVersionCode = 5;
/**
 * iOS semantic build code (increment with each submitted build)
 *
 * NOTE: Different from Android version code in that it may be reset
 *         with each version change; however, this is deemed confusing!
 */
const iosBuildNumber = 5;

/**
 * Runtime version associated with build manifest, used when applying OTA updates.
 *
 * Expo will attempt to apply OTA updates as long as the runtime version of the update matches
 *   the previously installed runtime version. This field should be updated whenever native
 *   code changes or any non-backwards compatible changes are made!
 *
 * @source https://docs.expo.dev/eas-update/runtime-versions/
 */
const runtimeVersion: ExpoConfig["runtimeVersion"] = {
  // NOTE: Custom runtime version fields prevent using the Expo Go app (in favour of custom dev client)
  // TODO: Investigate using custom dev client, which may require simulator for development updates???
  // Source: https://docs.expo.dev/build/updates/#previewing-updates-in-development-builds
  policy: "sdkVersion",
};

export default (): ExpoConfig => ({
  // Information
  name: `My Days${appVariantNameSuffix}`,
  slug: "my-days",
  githubUrl: "https://github.com/kendallroth/my-days",
  version: versionName,
  runtimeVersion,
  owner: "kendallroth",
  orientation: "portrait",
  platforms: ["android", "ios"],
  primaryColor: lightenedPrimaryColor,

  jsEngine: "hermes",
  // External link configuration prefix/scheme
  scheme: `my-days${appVariantSchemeSuffix}`,

  // Theme
  icon: "./assets/icon_shadow.png",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "cover",
    backgroundColor: lightenedPrimaryColor,
  },

  assetBundlePatterns: ["**/*"],

  // Android overrides
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/android_launcher_foreground.png",
      backgroundColor: lightenedPrimaryColor,
    },
    package: `ca.kendallroth.my_days${appVariantAppIdSuffix}`,
    permissions: [],
    versionCode: androidVersionCode,
    playStoreUrl: "https://play.google.com/store/apps/details?id=ca.kendallroth.my_days",
  },
  androidNavigationBar: {
    // TODO: Explore customizing colour perhaps???
    barStyle: "light-content",
  },

  // iOS overrides
  ios: {
    appStoreUrl: "https://apps.apple.com/us/app/my-days/id1669868291",
    buildNumber: `${iosBuildNumber}`,
    bundleIdentifier: `ca.kendallroth.my-days${appVariantAppIdSuffix}`,
    // Icon must be 1024x1024 (no transparency)
    icon: "./assets/icon_shadow.png",
    supportsTablet: false,
  },

  // Deployment
  extra: {
    easBuildGitCommit: process.env.EAS_BUILD_GIT_COMMIT_HASH ?? null,
    eas: {
      projectId: "0f596901-0769-4dcf-af51-73106137d331",
    },
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: "https://u.expo.dev/0f596901-0769-4dcf-af51-73106137d331",
  },
});
