## EAS Update

> [!Warning]
> Documentation may be significantly out of date (last updated in 2023)!

> [!Note]
> Apparently a custom `runtimeVersion` field prevents using the Expo app both in development and for released update previews (see "Caveats" below)!

[EAS Update](https://docs.expo.dev/eas-update/how-eas-update-works/) is used to provide minor bug fixes and improvements over-the-air, without requiring publishing an update to app stores and waiting for users to download it. Changes made this way should then be made into a published fix/patch or batched with a variety of similar changes. Since the app version technically does not get incremented during OTA updates (since they are non-native), any changes should be considered part of the subsequent version.

Updates are only applied if the "runtime version" of the installed build and the target "runtime version" of the update are identical (currently set to `appVersion` in config).

Updates can be created with `eas update --auto`, which will auto-populate the EAS branch and update message from last Git commit. Optionally, branches can be specified specifically with `eas update --branch [branch] --message [message]`.

### Caveats

Apparently updates published with a custom `runtimeVersion` field **cannot** be used in the Expo Go app! Additionally, Expo Go cannot even be used for development with a non-SDK version specified! This is very poorly documented in ([EAS Build docs](https://docs.expo.dev/build/updates/#previewing-updates-in-development-builds)), with no mention in EAS Update docs!

Due to this major caveat, EAS Update must _only_ be used for critical bug fixes and tweaks, and absolutely avoided if there are any native packages changed/added!
