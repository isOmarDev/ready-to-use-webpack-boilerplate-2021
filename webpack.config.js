// Node modules
const { resolve } = require('path');

// Webpack plugins
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")

// from command, check if node_env is set to "production" or "developement"
const isProd = process.env.NODE_ENV === "production";

// Webpack configuration object
const config = {
  mode: isProd ? "production" : "development",                                                                        // setup mode based on script command
  devtool: isProd ? "source-map" : "eval-source-map",                                                                 // generate sourcemap based on enviroment
  entry: {
    app: "./src/app.tsx" 
  },                                                                                                                  // read js entry point 
  output: {                                                                                                     
    path: resolve(__dirname, "dist"),                                                                                 // build js entry file to designited folder and set filename
    filename: isProd ? "[name].[contenthash].bundle.js" : "[name].bundle.js",                                         // hashed file name is for prod.
    clean: true                                      
  },
  module: {
    rules: [
      {
        loader: "babel-loader",                                                                                       // webpack will check babelrc file and compile it 
        test: /\.(js|jsx|tsx|ts)$/,
        exclude: /node_modules/,
        resolve: { extensions: ['', '.js', '.jsx', '.tsx'] }
      },
      {
        test: /\.html$/,                                                                                              // changing all your images references to the require
        use: ["html-loader"]
      },
      {
        test: /\.(svg|png|jpg|gif)$/,                                                                                 // works with html-loader to handle pasring imgs
        use: {
          loader: "file-loader",
          options: { name: "[name].[hash].[ext]", outputPath: "assets" }
        }
      },
      {
        test: /\.scss$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : "style-loader",                                                      // takes commonjs of css and create seperate file or inject css in DOM
          { loader: "css-loader", options: { importLoaders: 1 } },                                                    // converts css to commonjs
          {
            loader: "postcss-loader",                                                                                 // generate autoprefixers for css properties
            options: {
              postcssOptions: { 
                plugins: [ ["autoprefixer", {grid: true}] ] 
              },
            },
          },                                                                              
          { loader: "sass-loader" }                                                                                   // converts scss to css                                                                                                  
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({                                                                                           // will inject the bundled files into the index.html 
      template: "./src/index.html",
      minify: isProd ? { removeAttributeQuotes: true, collapseWhitespace: true, removeComments: true } : false,       // minify html in prod
      inject: "body"  
    })
  ]
};

// adds devServer if enviroment from command is set to development
if(isProd) {
  config.optimization = { minimizer: [ '...', new CssMinimizerPlugin() ] };                                           // minimize css on prod mode
  config.plugins = [ ...config.plugins, new MiniCssExtractPlugin( { filename: "styles.[contenthash].css" } ) ]        // exctracts imported css/scss into seperate  files and bundles them
} else {
  config.devServer = { static: { directory: resolve(__dirname, "src") }, historyApiFallback: true, port: 5000 }       // initiate devserver on dev mode
}

// console.log(config)

module.exports = config