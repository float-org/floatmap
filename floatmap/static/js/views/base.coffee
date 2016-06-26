###
 TO DO
  - Move GeoModel code to separate file
  - Separate out code into better named methods
  - Fix tooltips not rendering
  - Test popup w/ Elasticsearch
###

FloatLayout = app.FloatLayout = Backbone.Layout.extend
  template: "#floatLayout"
  initialize: () ->
    # TODO: Separate tour from welcomeview so we don't have to instantiate it at all if the cookie exists

    welcome = new WelcomeView()
    if not $.cookie('welcomed')
      console.log this
      this.insertView('#welcome', welcome)
      $.cookie('welcomed', true)

  views:
    '#header': new HeaderView()
    'map': new MapView()
    '#legend': new LegendView()
    '#share': new ShareView()

module.exports = FloatLayout;
