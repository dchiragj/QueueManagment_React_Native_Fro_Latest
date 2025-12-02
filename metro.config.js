
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    unstable_enablePackageExports: true,   // ← THIS IS THE ONE THAT FIXES IT
  },
  transformer: {
    unstable_allowRequireContext: true,
  },
};

module.exports = mergeConfig(defaultConfig, config);