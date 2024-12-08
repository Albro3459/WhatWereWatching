// const { getDefaultConfig } = require('expo/metro-config');

// const config = getDefaultConfig(__dirname);

// // Add `.json` to asset extensions
// config.resolver.assetExts.push('json');

// // Remove `.json` from source extensions
// config.resolver.sourceExts = config.resolver.sourceExts.filter((ext) => ext !== 'json');

// module.exports = config;


const { getDefaultConfig } = require('@expo/metro-config');
const { mergeConfig } = require('@react-native/metro-config');

// Get the default Expo configuration
const defaultConfig = getDefaultConfig(__dirname);

// Customize the configuration for SVG support
const customConfig = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
    unstable_allowRequireContext: true,
  },
  resolver: {
    assetExts: defaultConfig.resolver.assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
  },
};

// Merge the default Expo config with the custom SVG configuration
module.exports = mergeConfig(defaultConfig, customConfig);