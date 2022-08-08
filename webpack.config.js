const path = require('path');

module.exports = {
  entry: './src/index.js',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
      test: /\.css$/i,
      use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpg|jpeg|png|bmp|gif|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};