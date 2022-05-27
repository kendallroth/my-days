# Patches

`patch-package` allows modifying installed NPM packages directly in `node_modules`, then generating a patch to apply to future installations of that package. This enables modifying package behaviour or fixing bugs without having to wait for upstream changes. "My Days" uses several packages that require patching in some form, whether for bugs or changing functionality.

### React Native Gesture Handler

`react-native-gesture-handler` does not support animated styles on the `Swipeable` component, which is required to animate element opacity when swiping an item. The patch simply modifies the TypeScript definitions and is only necessary in development.

### `@react-native-community/eslint-config`

Even with Expo SDK 45, `@react-native-community/eslint-config` does not quite properly install all dependencies. I have attempted to fix this via a patch, but if it does not work in other setups it may be best to manually install all its dependencies.
