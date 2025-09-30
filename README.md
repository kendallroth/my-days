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

## Setup

- Follow official [React Native setup guide](https://reactnative.dev/docs/set-up-your-environment)
  - **Important:** Additionally, read [Android](./docs/setup-android.md) or [iOS](./docs/setup-ios.md) setup guides for additional details/information!
- Copy `.env` file from `.env.example`, then modify as appropriate for environment/target
- Ensure proper Node version with NVM (`nvm install && nvm use`) (see "Gotchas")
- Install package dependencies (`npm install`)

## Development

```sh
# Start Metro bundler (with hot reload)
npm run start

# Start Metro bundler after clearing build cache
npm run start -- --clear
```

Additional packages can be installed with `npx expo install <package>`, which will install versions compatible with the current Expo SDK version.

## Running the App

Expo is used for generating native code/projects from the managed codebase. After making any native-related changes, whether installing additional packages with native plugins, or adding config/plugins/mods, the native projects can be regenerated with `npx expo prebuild` (with optional `-p` platform flag). Since we are relying on Expo to manage the native code, using `--clean` flag to ensure a clean build is recommended.

> **NOTE**: Expo Prebuild does **not** have to be run after JS changes, only after changes with potential native implications!

- Create a (clean?) prebuild with Expo (generates native android/ios directories)
  - ⚠️ _Only needs to be run on initial setup or after changes with potential native implications (installing packages, etc)_
- Run on an emulator/simulator (or connected device)
  - ⚠️ _Android should work as-is; iOS may require slight XCode configuration (see iOS setup docs)_

```bash
npx expo prebuild --clean

# Optional: Run commands with env variables loaded
env $(grep -v "^#" .env | xargs) [command]
# Optional: Run commands without public variables loaded (ie. local EAS builds, etc)
env $(grep -vE “^#|EXPO_PUBLIC_” .env | xargs) [command]
```

### Emulator/Simulator vs Connected Device

The app can be run either on an emulator/simulator (easiest, but with limitations) _or_ connected physical device (requires additional setup for Apple). Running on an emulator/simulator is the easiest to configure and run, but cannot access the camera (native only). However, using a physical device requires the use of a network proxy to expose the local API to the connected devices (works automatically with emulator/simulator). Additionally, development on physical iOS devices may require adding them to the project somehow (maybe in Expo somewhere?) for authorization. Use the `--device` flag when starting the Metro bundler to run on a connected device (also required when first installing a development build).

> [!Note]
> Running on an emulator/simulator requires a different `API_URL` per platform (if using local API)! For example, Android must use `http://10.0.2.2:<port>` while iOS must use `http://localhost:<port>`!

Using a connected physical device requires either proxying the local API in order to be accessible by the phone **or** using the local server's network IP. A forwarding service like `ngrok` ([docs](https://ngrok.com/download)) can be used to easily forward the local API to the public internet. After downloading and configuring `ngrok`, simply run `ngrok http <port>` to expose the local API port on a remote URL. Next, update the mobile `.env` file with the correct `API_BASE_URL`, restart the mobile bundler, and you should be able to access the local API from a difference device!

> [!Note]
> When running on a connected physical device, the API **must** be exposed "publicly" (ie. either via the local server's network IP **or** using a service like `ngrok`, etc) in order for the app to be able to access the API!

### Dev Client

Expo Dev Client is used to generate a [development build](https://docs.expo.dev/develop/development-builds/introduction/) of the application with the Expo Devtools built-in (similar to Expo Go devtools) using `expo-dev-client`. These development builds (generated with `npm run [ios|android]`) are capable of hot reloading changes, in addition to other Expo Devtool flows.

> [!Note]
> While Expo Go is sufficient for quick prototyping, it prevents using any packages with native changes (if not already included in Expo Go native app). By comparison, Expo Dev Client effectively allows creating a native app with Expo Go's debug tools _but_ with support for custom native code.

### Troubleshooting

If you run into trouble with local builds, try running `npx expo-doctor` to (potentially) provide insight on what is wrong.

### Expo Dev Client vs Expo Go

While Expo Go is sufficient (and incredibly helpful) for quick prototyping, it prevents using any packages with native changes (if not already included in Expo Go native app) and is only intended for quick prototyping. By comparison, Expo Dev Client can be used to generate a [development build](https://docs.expo.dev/develop/development-builds/introduction/) of the application with the Expo Devtools built-in (similar to Expo Go devtools) using `expo-dev-client`. These development builds (generated with `npm run [ios|android]`) are capable of hot reloading changes, in addition to other Expo Devtool flows.

### Windows WSL2

Developing in WSL2 requires some [additional configuration](./docs/expo-with-wsl2.md) and different start up process.

## Environment Variables

Environment variables can be used to configure the build process (`app.config.ts`) or the app itself (accessed via `Constants.expoConfig.extras`). However, env variables **must** be set differently depending on the execution environment! In development, env variables must be passed into the NPM script (loaded automatically from `.env` when using Expo CLI, but **not** local EAS builds!). In EAS Build, environment variables come from `eas.json`. **However,** when using EAS Build _locally_, non-`eas.json` secrets must be passed into the command manually (see "Secrets" in [EAS Build & Release](./docs/eas-build.md)).

- [EAS Build](https://docs.expo.dev/build-reference/variables/)
- [EAS Update](https://docs.expo.dev/eas-update/environment-variables/)

> [!Note]
> Public (ie. bundled) environment variables **must** be prefixed with `EXPO_PUBLIC_` in order to be substituted in the build phase!

> [!Note]
> Environment variables are validated during the build step and will prevent builds with missing/invalid values! When running Expo commands locally, it may be necessary to load the environment variables prior to executing commands (see examples above using `env`).

| Name          | Description                                                                                   |
| ------------- | --------------------------------------------------------------------------------------------- |
| `APP_VARIANT` | App variant/environment allows multiple (non-prod) installations via package/bundle ID suffix |

### App Variants (via `APP_VARIANT`)

The `APP_VARIANT` environment variable enables multiple installations (of different variants) on the same device. The variant determines the suffix that will be applied to the app name, app ID, package/bundle ID, linking scheme, etc. Additionally, this value may be used to determine whether app is considered production or development (Sentry logs, etc).

- `development` - Development build (for development/testing, etc)
- `preview` - Staging production-like build (for testing, etc)
- `production` - Production build (suitable for app stores)

> [!Note]
> The `APP_VARIANT` will/should usually match `channel` (which is only used for EAS Update and is relatively flaky/unreliable).

> [!Note]
> Some projects may not be able to use different package/bundle IDs if dependencies rely on a single of package/bundle ID (ie. Google SDK, etc). In this case, simply remove the non-applicable parts in the conditional statements. However, the app variant itself can still be useful for per-environment app configuration 🤷.

## Build / Submit

EAS Build and EAS Submit can be used to automate the build and submission process ([build documentation](./docs/eas-build.md)).

## Patches

Read [patch documentation](./patches/README.md) for details on using `patch-package` to patch a variety of bugs or undesired functionality in a few packages.

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
