const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/ferui-icons/index.ts',
    'interfaces/icon-interfaces': './src/ferui-icons/interfaces/icon-interfaces.ts',
    'utils/descriptor-config': './src/ferui-icons/utils/descriptor-config.ts',
    'ferui-icons-api': './src/ferui-icons/ferui-icons-api.ts',
    'ferui-icons-element': './src/ferui-icons/ferui-icons-element.ts',
    'ferui-icons-lite.min': './src/ferui-icons/index.ts',
    'ferui-icons.min': './src/ferui-icons/ferui-icons-sfx.ts',
    'shapes/all-shapes': './src/ferui-icons/shapes/all-shapes.ts',
    'shapes/all-shapes.min': './src/ferui-icons/shapes/all-shapes.ts',
    'shapes/core-shapes': './src/ferui-icons/shapes/core-shapes.ts',
    'shapes/core-shapes.min': './src/ferui-icons/shapes/core-shapes.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist/ferui-icons'),
    filename: '[name].js',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  target: 'web',
  resolve: {
    modules: ['./node_modules'],
    extensions: ['.ts', '.ts', '.js'],
  },
  devtool: 'source-map',
  plugins: [
    new UglifyJsPlugin({
      include: /\.min\.js$/,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loaders: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              configFileName: 'src/ferui-icons/tsconfig.icons.json',
            },
          },
        ],
      },
    ],
  },
};
