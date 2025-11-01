module.exports = {
  presets: ["module:@react-native/babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./src"],
        alias: {
          "@Constants": "./src/Constants",
          "@Screens": "./src/Screens",
          "@Components": "./src/Components",
          "@Services": "./src/Services",
          "@Store": "./src/Store",
          "@Utils": "./src/Utils",
          "@Assets": "./src/Assets",
          "@Images": "./src/Assets/Images",
          "@Fonts": "./src/Assets/Fonts",
          "@Validations": "./src/Validations",
          "@Navigation": "./src/Navigation",
          "@Models": "./src/Models",
          "@Contexts": "./src/Contexts",
          "@Types": "./src/Types",
          "@Hooks": "./src/Hooks",
          "@Theme": "./src/Theme",
          "@Schemas": "./src/Schemas",
        },
      },
    ],
    "react-native-reanimated/plugin",
  ],
};
