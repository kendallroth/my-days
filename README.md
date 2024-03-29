# My Days

![](https://github.com/kendallroth/my-days/workflows/Code%20Quality/badge.svg)
![](https://img.shields.io/github/v/release/kendallroth/my-days?include_prereleases)
![](https://img.shields.io/badge/android--lightgreen?logo=android&logoColor=lightgreen)
![](https://img.shields.io/badge/apple--lightgrey?logo=apple&logoColor=offwite)

Simple app that counts down/up to important dates!

<a href="https://play.google.com/store/apps/details?id=ca.kendallroth.my_days&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1">
  <img alt="Get it on Google Play" height="64" src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" />
</a>
<a href="https://apps.apple.com/us/app/my-days/id1669868291?itsct=apps_box_badge&amp;itscg=30200">
  <img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&amp;releaseDate=1675641600" alt="Download on the App Store" height="64" style="padding: 10px; box-sizing: border-box" >
</a>

## Contributing

Thanks to [all those](CONTRIBUTORS.md) who have contributed to this project so far!

## Development

```sh
# Start Metro bundler (with hot reload)
npm run start

# Start Metro bundler after clearing build cache
npm run start -- --clear
```

### Windows WSL2

Developing in WSL2 requires some [additional configuration](./docs/expo-with-wsl2.md) and different start up process.

## Environment Variables

Environment variables can be used to configure the build process (`app.config.ts`) or the app itself (accessed via `Constants.expoConfig.extras`). However, env variables **must** be set differently depending on the execution environment! In development, env variables must be passed into the NPM script. In EAS Build, environment variables come from `eas.json`. In EAS Update, environment variables come from the local environment. Knowing this distinction is crucial to proper build/updates!

- [EAS Build](https://docs.expo.dev/build-reference/variables/)
- [EAS Update](https://docs.expo.dev/eas-update/environment-variables/)

| Name | Description |
|------|-------------|
| `APP_VARIANT` | App variant determines whether a suffix should be added to Package/Bundle ID to allow multiple installations (non-prod)


## Releases

Releases can be deployed through Expo Go (for testing) or the Expo managed build system (for release). The app version is taken from the `package.json`, which should be updated before every major deployment. App environment configuration is possible with the `expo-updates` package, which exposes the value of the `releaseChannel` used when building the app.

> **NOTE:** Remember to update the semantic `versionName` **and** increment `androidVersionCode`/`iosBuildNumber` in `app.config.ts` before each release/deployment!

### Locally

Builds can be run locally to avoid waiting in Expo Build queues and monthly plan limitations. To run local builds, add the `--local` flag to the `eas build` command.

Android builds produce an `.apk` file that can be installed on a device. iOS builds produce an `.ipa` file that can be installed from a Mac onto a connected device, visible through "Devices and Simulators > Devices > Connected" through XCode.

> **WARNING:** Local iOS builds seem to fail with not finding `hermes` runtime, and should use `jsc` for the JS engine (do not commit!). Additionally, iOS logs can be found by opening XCode, then selecting "Devices and Simulators" and selecting the connected device.

### Credentials ([docs](https://docs.expo.dev/app-signing/app-credentials/))

Credentials are managed entirely by EAS, to avoid losing local credentials.

### Testing Releases ([docs](https://docs.expo.dev/build/internal-distribution/))

#### Android (APK) ([docs](https://docs.expo.dev/build-reference/apk/))

An APK can be generated for manual device testing with `eas build -p android --profile [profile]`, where profile is either `development` (development build) or `preview` (production-like build). Once the remote build finishes, the resulting APK can be installed by following the directions either from the terminal or Expo site. An APK can be downloaded and will need to be allowed through security and installed on the device.

#### iOS Ad-Hock ([docs](https://docs.expo.dev/build/internal-distribution/#22-configure-app-signing-credentials-for-ios))

iOS builds can be generated for specifically provisioned phones, via an ad hoc provisioning process (requires registering device via UDID with Apple). Once provisioned, builds can be generated for manual device testing with `eas build -p ios --profile [profile]`, where profile is either `development` (development build) or `preview` (production-like build). Once the remote build finishes, the resulting bundle can be installed on a provisioned device from the terminal or Expo site.

### Production Releases

Production builds and releases are handled with [EAS Build](https://docs.expo.dev/build/introduction/) and [EAS Submit](https://docs.expo.dev/submit/introduction/).

> **NOTE:** Remember to properly update the `version` (`package.json`) and increment the `androidVersionCode`/`iosBuildNumber` (`app.config.ts`) before each release intended for submission!

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

#### Production Submission ([EAS Submit](https://docs.expo.dev/submit/introduction/))

Production builds utilize the [EAS CLI](https://github.com/expo/eas-cli) and [EAS Submit](https://docs.expo.dev/submit/introduction/) to automatically submit builds to the app stores. The EAS CLI requires some minor input for both Android and iOS platforms (bundle, credentials, etc), similar to the build workflow. Submission is typically a very fast process, and once the apps have been submitted they may be included in app store releases.

```sh
# Submit for a specific platform
eas submit --platform android
eas submit --platform ios
```

Once a production app has been built and submitted, a release can be created in the appropriate app store.

##### Google Play Store

Google Play submissions are automatically released to the "Internal" track, which does not require submission approval before testing. After internal testing, the app can be promoted to either a Closed/Open test, or directly to production, after it has been approved. Release notes and details can be specified each time a release is promoted, although typically they will be changed only when promoting out of Internal testing. Promoting an app to the production track will officially release the new version to users.

##### Apple App Store

Apple submissions are not automatically released to an internal testing track, but instead must have a new release created from the App Connect dashboard. The new release will inherit information from previous releases, and needs to have its version updated, release notes added, and a bundle selected. The release can then be submitted to TestFlight, allowing internal testing, before submitting for production review.

#### Production Updates ([EAS Update](https://docs.expo.dev/eas-update/how-eas-update-works/))

> **NOTE:** Apparently a custom `runtimeVersion` field prevents using the Expo app both in development and for released update previews (see "Caveats" below)!

EAS Update is used to provide minor bug fixes and improvements over-the-air, without requiring publishing an update to app stores and waiting for users to download it. Changes made this way should then be made into a published fix/patch or batched with a variety of similar changes. Since the app version technically does not get incremented during OTA updates (since they are non-native), any changes should be considered part of the subsequent version.

Updates are only applied if the "runtime version" of the installed build and the target "runtime version" of the update are identical (currently set to `appVersion` in config).

Updates can be created with `eas update --auto`, which will auto-populate the EAS branch and update message from last Git commit. Optionally, branches can be specified specifically with `eas update --branch [branch] --message [message]`.

##### Caveats

Apparently updates published with a custom `runtimeVersion` field **cannot** be used in the Expo Go app! Additionally, Expo Go cannot even be used for development with a non-SDK version specified! This is very poorly documented in ([EAS Build docs](https://docs.expo.dev/build/updates/#previewing-updates-in-development-builds)), with no mention in EAS Update docs!

Due to this major caveat, EAS Update must _only_ be used for critical bug fixes and tweaks, and absolutely avoided if there are any native packages changed/added!

## UI

### Components

Components are based on the [React Native Paper](https://callstack.github.io/react-native-paper/) library, an interpretation of the Material Design guidelines for React Native.

### Images

Vector images are taken from [UnDraw](https://undraw.co/illustrations) and edited in Affinity Photo to remove the background.

### App Icons

Icons were generated with the [Build Icon](https://buildicon.netlify.app) tool or [Icon Kitchen](https://icon.kitchen/).

## Notes

### Resources

- [Environment Configuration](https://docs.expo.dev/distribution/release-channels/#using-release-channels-for-environment-variable-configuration)
- [i18n Localization](https://brainsandbeards.com/blog/i18n-in-react-native-apps)
- [React Navigation TypeScript](https://reactnavigation.org/docs/typescript)

#### Patchas

`patch-package` is used to patch a variety of bugs or undesired functionality in a few packages. Note that editing/patching source files works in development, but the build files must be patched for use in production!
