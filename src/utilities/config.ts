import Application from "expo-application";
import Constants from "expo-constants";
import Updates from "expo-updates";

import { version as packageVersion } from "../../package.json";

const runningInExpo = Constants.appOwnership === "expo";

const version = !runningInExpo ? Application.nativeApplicationVersion : packageVersion;
const versionBuild = !runningInExpo ? Application.nativeBuildVersion : packageVersion;

/** App configuration links */
interface IAppConfigLinks {
  /** App developer email */
  developerEmail: string;
  /** App developer URL */
  developerUrl: string;
  /** Repository URL */
  repositoryUrl: string;
}

/** App configuration */
interface IAppConfig {
  /** App links */
  links: IAppConfigLinks;
  /** Deployment release channel */
  releaseChannel: string;
  /** Updates runtime version */
  runtimeVersion: string;
  /** App version name (semantic) */
  version: string;
  /** App version build number */
  versionBuild: string;
}

const config: IAppConfig = {
  links: {
    developerEmail: "kendall@kendallroth.ca",
    developerUrl: "https://www.kendallroth.ca",
    repositoryUrl: "https://github.com/kendallroth/my-days",
  },
  // NOTE: Release channel is only present with update workflow (and not in development builds)!
  releaseChannel: Updates.channel ?? "default",
  runtimeVersion: Updates.runtimeVersion ?? "N/A",
  version: version ?? packageVersion,
  versionBuild: versionBuild ?? packageVersion,
};

export default config;
