/**
 * TODO: separate dev and prod configurations.
 */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: path.resolve('src', 'index.ts'),
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [{
        test: /\.ts$/,
        enforce: 'pre',
        use: [{
          loader: 'tslint-loader',
          options: {
            typeCheck: true,
            emitErrors: true
          }
        }],
        exclude: /node_modules/,
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  },
  devServer: {
    contentBase: 'dist',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
  ]
}
