module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            assets: './assets',
            src: './src',
            components: './src/components',
            contexts: './src/contexts',
            hooks: './src/hooks',
            navigations: './src/navigations',
            screens: './src/screens',
            services: './src/services',
            utils: './src/utils'
          },
          extensions: [".tsx", ".ts", ".js", ".json"],
        }
      ],
      'react-native-reanimated/plugin'
    ]
  };
};
