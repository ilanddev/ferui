const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/ferui-icons/index.ts',
    'ferui-icons.min': './src/ferui-icons/index.ts',
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
    extensions: ['.ts', '.js'],
  },
  devtool: 'source-map',
  plugins: [
    new UglifyJsPlugin({
      include: /\.min\.js$/,
    })
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
