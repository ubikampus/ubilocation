/**
 * TODO: separate dev and prod configurations.
 */

const path = require('path');
const process = require('process');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? undefined : 'inline-source-map',
  entry: path.resolve('src', 'index.tsx'),
  resolve: {
    extensions: ['.ts', '.js', '.tsx']
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [{
        test: /\.tsx?$/,
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
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpg|gif|babylon)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  devServer: {
    host: '0.0.0.0',  // enable usage of another device in the network
    contentBase: 'dist',
    historyApiFallback: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),

    // something weird going on with EnvironmentPlugin? Lets use defineplugin
    // instead
    new webpack.DefinePlugin({
      DEFINE_NODE_ENV: JSON.stringify(isProd ? 'production' : 'development'),
    }),

    new CopyPlugin(['asset/404.html'])
  ]
}
