module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Reanimated pulgin must be last item in plugins!
      "react-native-reanimated/plugin",
    ],
    env: {
      production: {
        plugins: [
          // Only import used modules (vs entire library)
          "react-native-paper/babel",
          // Remove console statements from app during release builds
          "transform-remove-console",
        ],
      },
    },
  };
};
