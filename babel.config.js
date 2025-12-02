module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'babel-plugin-module-resolver',
      {
        alias: {
          '@app': './app',
          '@components': './components',
        },
      },
    ],
    // Reanimated plugin MUST be last
    'react-native-reanimated/plugin',
  ],
};
