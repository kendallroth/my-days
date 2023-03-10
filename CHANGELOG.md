# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.2] - 2023-03-10

### Fixed
- Day Details always showed countdown state

## [0.4.1] - 2023-03-10

### Added
- Behaviour setting to ignore icon tags in search (performance)
- Add more day icons
- State storage migration workflow

### Fixed
- Remove "start on open" day flag if day is removed (prevents crash)

## [0.4.0] - 2023-03-09

### Added
- Select a day to open with app launch
- Page for adding and editing days

### Updated
- Improve icon selection workflow (added display, search)
- Add a few more transportation icons
- Support locale-based numeric formatting
- Add GitHub issue templates
- Prepend commit messages with issue number (from branch)
- Upgrade to Expo SDK 48

### Removed
- Dialog workflow for adding and editing days

### Fixed
- Proper order of time units on "Details" screen
- Scale font size in list item view for large numbers
- Reduce flicker when initially hiding splash screen
- Improve date difference calculations
- Ensure FAB is visible whenever refocusing Home screen
- Regression with `react-native-get-random-values` (from `uuid`) caused by Expo SDK update


## [0.3.0] - 2023-02-10

### Added
- View date details and various time units
- Change individual date display time units
- Store URL in About screen developer chips
- Behaviour setting to swap theme on "Details" screen

### Updated
- Abstracted common date actions into hooks


## [0.2.0] - 2023-02-09

### Added
- Ability to share days via config link
- Behaviour setting to confirm adding a shared day
- Show build Git hash and application ID on "Debug" screen
- Ability to copy device debug info

### Changed
- Support multiple installs with dynamic application ID
- Indicate when countdown/countup day is current date


## [0.1.1] - 2023-02-05

### Changed
- Update "Debug" screen values for EAS Updates*

### Fixed
- Prevent date selection dialog flicker when transitioning workflows
- Lighten initial splash screen color


## [0.1.0] - 2023-02-04

### Added
- Manage important dates via countdown/countup
- "About" and "Contributors" screens
- App theming and localization
- App reset workflow
- Developer menu and options
