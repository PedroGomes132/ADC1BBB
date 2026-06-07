const WebpackObfuscator = require('webpack-obfuscator');

module.exports = function (options) {
  return {
    ...options,
    devtool: 'inline-source-map',
    plugins: [
      new WebpackObfuscator(
        {
          rotateStringArray: true,
          sourceMap: true,
          optionsPreset: 'medium-obfuscation',
          disableConsoleOutput: false,
        },
        [],
      ),
    ],
  };
};
