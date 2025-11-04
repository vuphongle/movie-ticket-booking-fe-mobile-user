const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    alias: {
      "@Constants": "./src/Constants",
      "@Components": "./src/Components",
      "@Screens": "./src/Screens",
      "@Services": "./src/Services",
      "@Store": "./src/Store",
      "@Utils": "./src/Utils",
      "@Assets": "./src/Assets",
      "@Navigation": "./src/Navigation",
      "@Contexts": "./src/Contexts",
      "@Types": "./src/Types",
      "@Hooks": "./src/Hooks",
      "@Theme": "./src/Theme",
    },
    assetExts: defaultConfig.resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...defaultConfig.resolver.sourceExts, "svg"],
  },
  transformer: {
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
