var webpack = require('webpack');

module.exports = {
  entry: "./floatmap/static/js/app.js",
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          /floatmap\/static\/js/,
        ],
        query: {
          babelrc: false,
          presets: [
            ['es2015', {"modules": false}]
          ]
        }
      }
    ]
  },
  output: {
    path: __dirname,
    filename: "floatmap/static/bundle.js"
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "Backbone.Layout": "backbone.layoutmanager"
    })
  ]
}
