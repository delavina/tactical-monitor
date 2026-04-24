module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          envName: 'APP_ENV',
          moduleName: '@env',
          path: '.env.app1', // Default to app1
          safe: false,
          allowUndefined: true,
          verbose: false,
        },
      ],
    ],
  };
};