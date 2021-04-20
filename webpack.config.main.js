const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require("webpack");
const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (argv, argc) => {
  const mode = argc.mode;
  const isDev = mode == "development";
  const isProd = mode == "production";
  console.log(mode);
  const entry = {
    main: ["./client/index.js"]
  };

  if (isDev) {
    Object.keys(entry).forEach((x) => {
      if (typeof entry[x] == "string") {
        entry[x] = [entry[x]];
      }
    });
  }

  const _module = {
    rules: [
      {
        test: /\.s?[ac]ss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          // "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
        loader: "url-loader",
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "/",
            },
          },
        ],
      },
    ],
  };

  const output = {
    filename: "js/[name].bundle.js",
    path: __dirname + "/public/",
  };

  const plugins = [
    new MiniCssExtractPlugin({
      filename: "css/[name].bundle.css",
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [autoprefixer()],
      },
    }),
  ];

  plugins.push(new CleanWebpackPlugin());
  // plugins.push(
  //   new HtmlWebpackPlugin({
  //     template:'./server/views/main.html',
  //     cache: false,
  //     cleanOnceBeforeBuildPatterns: ['**/*', '!static-files*'],
  //   })
  // );
  if (isDev) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
    plugins.push(new BundleAnalyzerPlugin({ openAnalyzer: true }));
  }

  return {
    entry,
    mode,
    devServer: {
      open: true,
    },
    module: _module,
    devtool: "source-map",
    output,
    plugins,
  };
};
