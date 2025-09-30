# iOS Development Setup

> [!Note]
> This information may be slightly outdated! Ruby 2.x is no longer supported; however, Ruby 3.x appears to work successfully 🤷.

- Ensure the React Native iOS [environment configuration guide](https://reactnative.dev/docs/set-up-your-environment) was followed
  - Requires XCode, etc
- Configure a simulator in XCode
  - After configuring a simulator, working within XCode likely will not be required again (can use Expo CLI instead)
- Ensure that XCode is configured with proper signing team
  - Sign into XCode with account associated with proper team
  - Within "Signing & Capabilities" project settings tab, verify the "Signing" section "Team" value
  - This may require receiving "Access to Certificates, Identifiers & Profiles" and "Access to Cloud Managed Distribution Certificate" permissions within Apple Developer

> [!Note]
> May need to handle Apple developer configuration/authorization first!
