const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add `.json` to asset extensions
config.resolver.assetExts.push('json');

// Remove `.json` from source extensions
config.resolver.sourceExts = config.resolver.sourceExts.filter((ext) => ext !== 'json');

module.exports = config;