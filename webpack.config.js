/**
 * TODO: separate dev and prod configurations.
 */

const path = require('path');
const process = require('process');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? undefined : 'inline-source-map',
  entry: path.resolve('src', 'index.ts'),
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: '[name].[contenthash].js',
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
      {
        test: /\.(png|svg|jpg|gif|babylon|gltf|bin)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  devServer: {
    contentBase: 'dist',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
  ]
}
