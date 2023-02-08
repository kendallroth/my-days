import * as Application from "expo-application";
import Constants from "expo-constants";
import * as Updates from "expo-updates";

import { version as packageVersion } from "../../package.json";

const runningInExpo = Constants.appOwnership === "expo";

// Some application items use the Expo Go version when running through Expo app
const applicationId = !runningInExpo ? Application.applicationId ?? "N/A" : "N/A";
const version = !runningInExpo ? Application.nativeApplicationVersion : `${packageVersion}*`;
const versionBuild = !runningInExpo ? Application.nativeBuildVersion : "N/A";

/** App build information */
interface AppBuildInfo {
  /** Package (Android) / Bundle ID (iOS) */
  applicationId: string;
  /** EAS Build/Update release channel */
  releaseChannel: string;
  /** EAS Updates runtime version (limits updates to matching versions) */
  runtimeVersion: string;
  /** App version name (semantic) */
  version: string;
  /** App version build number */
  versionBuild: string;
  /** Git commit SHA associated with build (EAS build only) */
  versionHash: string;
}

/** App configuration links */
interface AppConfigLinks {
  /** App developer email */
  developerEmail: string;
  /** App developer URL */
  developerUrl: string;
  /** Repository URL */
  repositoryUrl: string;
}

/** App configuration */
interface AppConfig {
  build: AppBuildInfo;
  /** App links */
  links: AppConfigLinks;
}

// NOTE: Fix an odd bug in development where env variable was an empty object???
const versionHashRaw = Constants.expoConfig?.extra?.easBuildGitCommit;
const versionHash = typeof versionHashRaw === "string" ? versionHashRaw.substring(0, 8) : "N/A";

const config: AppConfig = {
  build: {
    applicationId,
    // NOTE: Release channel and runtime version are only present with update workflow (and not in development builds)!
    // NOTE: Loose falsey checks are used to avoid empty strings (development)
    releaseChannel: Updates.channel || "default",
    runtimeVersion: Updates.runtimeVersion || "N/A",
    version: version ?? packageVersion,
    versionBuild: versionBuild ?? packageVersion,
    versionHash,
  },
  links: {
    developerEmail: "kendall@kendallroth.ca",
    developerUrl: "https://www.kendallroth.ca",
    repositoryUrl: "https://github.com/kendallroth/my-days",
  },
};

export default config;
