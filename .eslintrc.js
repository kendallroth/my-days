module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
    },
    project: "tsconfig.lint.json",
    sourceType: "module",
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
  plugins: ["import"],
  rules: {
    "@typescript-eslint/ban-ts-comment": "off",
    // Disable for all files (enable for TS)
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { varsIgnorePattern: "styles" }],
    // Returning an async call within try/catch requires an 'await' keyword to be able to handle errors!
    "@typescript-eslint/return-await": ["error", "in-try-catch"],
    curly: "off",
    // Types should be imported inline with other imports but with 'type' specifier
    "import/consistent-type-specifier-style": ["warn", "prefer-inline"],
    // Prevent (and combine) duplicate import declarations
    "import/no-duplicates": "warn",
    // Sort imports into alphabetical groups (sorting import keys is handled by 'sort-imports')
    "import/order": [
      "warn",
      {
        // Custom group definitions (uses 'minimatch')
        // NOTE: TS aliases are automatically categorized as 'internal' paths by plugin!
        pathGroups: [
          // Example: { pattern: "@{app,common,modules,typings}/**", group: "external", position: "after" }
        ],
        // Order import groups (can group multiple together)
        groups: [
          "builtin", // Built-in Node packages
          "external", // NPM depencencies
          "internal", // Internal aliases/paths (from TS config)
          ["parent", "sibling", "index"], // Relative paths
          "unknown", // All uncategorized imports
          "type", // Specific type imports (ie 'import type {} ...'), but technically ignored with inline types
        ],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: false,
        },
      },
    ],
    // Prevent files/modules from importing from themselves
    "import/no-self-import": "error",
    // Prevent useless import paths (ie. "./../something.ts" or "./pages/index.ts")
    "import/no-useless-path-segments": ["warn", { noUselessIndex: true }],
    "no-console": "warn",
    "prettier/prettier": "warn",
    "prefer-const": "warn",
    // NOTE: Uncertain why Prettier rules aren't respected if this is removed...
    quotes: ["warn", "double"],
    "react/display-name": "off",
    "react-native/no-color-literals": "warn",
    "react-native/no-inline-styles": "off",
    "react-native/no-unused-styles": "warn",
    "react/no-unstable-nested-components": "off",
    // Sort multiple import keys (sorting import declarations is handled by 'import/order')
    "sort-imports": [
      "warn",
      {
        // Ignore case to avoid placing PascalCase imports before camelCase (ie. 'import {Example, awesomeExample} ...')!
        ignoreCase: true,
        // Ignore sorting import declaration (handled by 'import/order')
        ignoreDeclarationSort: true,
      },
    ],
  },
  overrides: [
    // TypeScript overrides
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        // "@typescript-eslint/explicit-function-return-type": "warn",
        "@typescript-eslint/no-shadow": ["warn"],
        "no-shadow": "off",
      },
    },
  ],
  settings: {
    "import/extensions": [".js", ".ts"],
    "import/resolver": {
      typescript: {
        // Allow 'import' rules to reference TS config (for aliases, etc)
        project: "./tsconfig.json",
      },
    },
  },
};
