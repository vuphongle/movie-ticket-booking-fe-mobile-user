module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: ["react", "@typescript-eslint"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    // React 17+ JSX Transform - không cần import React
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-react": "off",

    // ⭐ Error on unused variables and imports - Đây là rule quan trọng nhất
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_", // Allow unused args starting with _
        varsIgnorePattern: "^_", // Allow unused vars starting with _
        caughtErrorsIgnorePattern: "^_", // Allow unused errors starting with _
        destructuredArrayIgnorePattern: "^_", // Allow unused destructured items starting with _
        ignoreRestSiblings: true, // Allow unused rest properties
      },
    ],
    "no-unused-vars": "off", // Turn off base rule as it's covered by @typescript-eslint

    // Additional useful rules
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-var-requires": "off", // Allow require in config files
    "@typescript-eslint/ban-types": "warn", // Warn instead of error for Function type
    "react/prop-types": "off", // TypeScript handles this
    "react/display-name": "off", // Allow anonymous components
    "no-useless-catch": "warn", // Warn instead of error
    "no-undef": "off", // TypeScript handles this better
  },
  env: {
    es2021: true,
    node: true,
    jest: true, // Enable Jest globals
  },
  overrides: [
    {
      // Config files can use CommonJS
      files: ["*.config.js", ".eslintrc.js", "babel.config.js"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
      },
    },
  ],
};
