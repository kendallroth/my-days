## EAS Build & Release

## Setup

There is some initial setup to build and login to Expo CLI, which can be installed globally with `npm install -g eas-cli` ([docs](https://docs.expo.dev/build/setup/)).

## Building / Releases

> [!Note]
> Remember to always appropriately update Android and iOS build numbers (and potentially version name) prior to release (in `app.config.ts`), and choose the correct EAS Build profile!

### Remotely

Builds can be run remotely to avoid having to setup/configure a local build environment. However, this will involve waiting in Expo Build queues and is subject to monthly plan limitations (_use local builds when possible to avoid this!_).

```sh
eas build --platform android --profile [development|preview|production]
eas build --platform ios --profile [development|preview|production]
```

### Locally

Builds can be run locally to avoid waiting in Expo Build queues and monthly plan limitations. To run local builds, add the `--local` flag to the `eas build` command.

```sh
npx expo prebuild --clean

[LOAD_ENV] eas build --local --platform android --profile [development|preview|production]
[LOAD_ENV] eas build --local --platform ios --profile [development|preview|production]
```

> [!Note]
> May be a good idea to run `npx expo prebuild --clean` prior to local builds (but likely unnecessary for remote builds).

Android builds can produce an `.apk` file (if configured) that can be installed on a device. iOS builds produce an `.ipa` or `.app` (may be zipped) file that can be installed from a Mac onto a connected device, visible through "Devices and Simulators > Devices > Connected" through XCode.

> [!Note]
> During local EAS builds, the `.env` file is _not_ automatically picked up during the build, but rather the variables from `eas.json` are used! See the "Secrets" section below for details on passing secrets to local EAS builds.

### Credentials ([docs](https://docs.expo.dev/app-signing/app-credentials/))

App signing credentials should be managed entirely by EAS, to avoid losing local credentials.

### Secrets

During EAS builds (whether local or remote), environment variables are handled via the `environment` section in the corresponding `eas.json` profile. Secret values that _cannot_ be committed to `eas.json` must be stored in EAS Secrets, and will be exposed in a similar way during **remote** builds. **However,** EAS Secrets are not exposed during **local** builds (only remote builds), which means required secrets must be **manually** provided to the build process/environment for local builds only!

```sh
env $(grep -v '^#' .env | xargs) [COMMAND]

# env $(grep -v '^#' .env | xargs) eas build --local --profile [development]
```

### Testing Releases (Internally) ([docs](https://docs.expo.dev/build/internal-distribution/))

EAS Build provides a `distribution: "internal"` flag that can be set on a profile to configure an internal-only build (ie. cannot be uploaded to stores / TestFlight). However, on iOS this requires ad-hoc provisioned devices (can be annoying), and as such all profiles _by default_ do not use internal distribution. However, this can be enabled with a `:internal` profile suffix, as these profiles simply extend the corresponding "base" profile with the addition of `distribution: "internal"`.

> [!Note]
> When building with `--local` flag, remember to ensure that required secrets (not stored in `eas.json`) are loaded in execution environment (see "Secrets")!

```sh
# Build for all platforms
eas build --profile [development|preview]

# Build for a specific platform
eas build --platform android --profile [development|preview]
eas build --platform ios --profile [development|preview]
```

#### Android (APK) ([docs](https://docs.expo.dev/build-reference/apk/))

An APK can be generated for manual device testing with `eas build -p android --profile [profile]`, where profile is `development` (uses local API) or `preview` (staging production-like build). Once the remote build finishes, the resulting APK can be installed by following the directions either from the terminal or Expo site. An APK can be downloaded and will need to be allowed through security and installed on the device.

> [!Note]
> Android APKs can be installed on devices regardless of whether they were generated for internal distribution or not (unlike iOS).

#### iOS

Since ad-hoc requires specifically provisioned phones, if uploading to TestFlight is sufficient the non `:internal` profiles can be used. These will generate an `.ipa` output (for iOS) that can be uploaded to TestFlight (ie. using `Transporter`). However, unlike ad-hoc device workflow, the version numbers must be incremented on every TestFlight release!

##### iOS Ad-Hoc ([docs](https://docs.expo.dev/build/internal-distribution/#22-configure-app-signing-credentials-for-ios))

iOS builds can also be generated for specifically provisioned phones, via an ad hoc provisioning process (requires registering device via UDID with Apple, which Expo simplifies). Once provisioned, builds can be generated for manual device testing with `eas build -p ios --profile [profile]`, where profile is either `development:internal` (uses test API) or `preview:internal` (production-like build). Once the remote build finishes, the resulting bundle can be installed on a provisioned device from the terminal or Expo site. Note that newly provisioned ad hoc devices will require a new EAS build before the new device can use the app!

### Production Releases

Production builds and releases are handled with [EAS Build](https://docs.expo.dev/build/introduction/) and [EAS Submit](https://docs.expo.dev/submit/introduction/).

> [!Note]
> Remember to always appropriately update Android and iOS build numbers (and potentially version name) prior to release (in `app.config.ts`), and choose the correct EAS Build profile (ie. `production`)!

#### Production Builds ([EAS Build](https://docs.expo.dev/build/introduction/))

Production builds utilize the [EAS CLI](https://github.com/expo/eas-cli) and [EAS Build](https://docs.expo.dev/build/introduction/) to automatically upload and build native artifacts for later submission. The EAS CLI requires some minor input for both Android and iOS platforms (credentials, paths, etc), which could be abstracted to `eas.json` but is not for security. Once the build(s) have been started, links are provided to view the build progress. An artifact download link will be generated once the build has completed; however, EAS Submit can automatically pull builds from EAS Build.

```sh
# Build for all platforms
eas build

# Build for a specific platform
eas build --platform android
eas build --platform ios
```

By default, these artifacts are intended for submission and cannot be used for testing (due to output format).

## Submission ([EAS Submit](https://docs.expo.dev/submit/introduction/))

> [!Note]
> Submission docs may be incomplete, as it has been some time since this was revisited. Additionally, when building locally it is likely not possible to use EAS Submit (intended for use with their online EAS Build platform).

Production builds utilize the [EAS CLI](https://github.com/expo/eas-cli) and _can utilize_ [EAS Submit](https://docs.expo.dev/submit/introduction/) to automatically submit builds to the app stores. The EAS CLI requires some minor input for both Android and iOS platforms (bundle, credentials, etc), similar to the build workflow. Submission is typically a very fast process, and once the apps have been submitted they may be included in app store releases.

```sh
# Submit for a specific platform
eas submit --platform android
eas submit --platform ios
```

Once a production app has been built and submitted, a release can be created in the appropriate app store.

#### Google Play Store

Google Play submissions are automatically released to the "Internal" track, which does not require submission approval before testing. After internal testing, the app can be promoted to either a Closed/Open test, or directly to production, after it has been approved. Release notes and details can be specified each time a release is promoted, although typically they will be changed only when promoting out of Internal testing. Promoting an app to the production track will officially release the new version to users.

#### Apple App Store

Apple submissions are not automatically released to an internal testing track, but instead must have a new release created from the App Connect dashboard. The new release will inherit information from previous releases, and needs to have its version updated, release notes added, and a bundle selected. The release can then be submitted to TestFlight, allowing internal testing, before submitting for production review.
