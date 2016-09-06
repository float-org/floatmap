  var path = require('path');
var webpack = require('webpack');
var BundleTracker  = require('webpack-bundle-tracker');

module.exports = {
  entry: [
    "./floatmap/static/js/app.js",
    'webpack-dev-server/client?http://localhost:3000', // WebpackDevServer host and port
    'webpack/hot/only-dev-server'
  ],
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.js$/,
        loaders: ['react-hot', 'babel-loader?presets[]=es2015,presets[]=react'],
        exclude: [
          /node_modules/
        ]
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: "bundle.js",
    publicPath: "http://localhost:3000/dist/"
  },
  plugins: [
    new BundleTracker({filename: './webpack-stats.json'}),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ]
}
