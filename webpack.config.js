const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    index: './index.js',
    admin: './admin/admin.js',
    entry_admin: './admin/entry_admin.js',
  },
  output: {
    filename: '[contenthash].bundle.js',
    path: path.resolve(__dirname, 'server/static'),
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: { '^/api': '' },
        changeOrigin: true,
        secure: false,
      },
    },
    watchFiles: ['src/index.html'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      filename: 'admin_entry.html',
      template: './admin/admin_entry.html',
      chunks: ['entry_admin'],
    }),
    new HtmlWebpackPlugin({
      filename: 'admin.html',
      template: './admin/admin.html',
      chunks: ['admin'],
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpeg|jpg|gif|svg|ttf|woff|woff2)$/i,
        // use: ['file-loader'],
        type: 'asset/resource',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          sources: true,
        },
      },
    ],
  },
};
