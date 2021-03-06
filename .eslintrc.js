module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    jasmine: true,
    jest: true,
  },
  extends: [
    // NOTE: Due to problem with package dependencies, had to install with legacy peer dependencies
    //         and then patch the Babel ESLint parser version in the package!
    "@react-native-community",
  ],
  rules: {
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { varsIgnorePattern: "styles" }],
    "@typescript-eslint/explicit-function-return-type": "off", // Disable for all files (enable for TS)
    curly: "off",
    "no-console": "warn",
    "prettier/prettier": "warn",
    "prefer-const": "warn",
    quotes: ["warn", "double"], // specify whether double or single quotes should be used
    "react/display-name": "off",
    "react-native/no-color-literals": "warn",
    "react-native/no-inline-styles": "off",
    // TODO: Determine if this rule is working
    "react-native/no-unused-styles": "warn",
    "react/no-unstable-nested-components": "off",
  },
  overrides: [
    // TypeScript overrides
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "@typescript-eslint/explicit-function-return-type": "warn",
        "@typescript-eslint/no-shadow": ["warn"],
        "no-shadow": "off",
      },
    },
  ],
};
