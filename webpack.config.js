const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const fs = require("fs");

function generateHtmlTemplate(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.map(item => {
    const parts = item.split(".");
    const name = parts[0];
    const extension = parts[1];
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      inject: false,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`)
    });
  });
}

const htmlPlugins = generateHtmlTemplate("./src/html_pages");

module.exports = {
  entry: {"index": './src/index.js',
          "catalog": './src/catalog.js',
          "checkout": './src/checkout.js'},
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              url: false,
              sourceMap: true
            }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.(eot|woff|otf|ttf|ttc|woff2)$/, 
        loader: 'file-loader',
        options: {
          name: "[name].[ext]",
          outputPath: "/fonts"
        }
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].css"
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/images/",
          to: "images/"
        }
      ]
    })
  ].concat(htmlPlugins),
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 8000
  }
};