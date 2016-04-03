###
 TO DO
  - Move GeoModel code to separate file
  - Separate out code into better named methods
  - Fix tooltips not rendering
  - Test popup w/ Elasticsearch
###


$ ->

  defaultIcon = L.icon
    iconUrl: 'static/img/marker-icon.png'
    shadowUrl: 'static/img/marker-shadow.png'
  

  # App namespace
  app = window.app = ( window.app || {} )

  # Option so that all created views are managed by LayoutManager (i.e. they behave like Layout)
  Backbone.Layout.configure
    manage: true    

  FloatLayout = app.FloatLayout = Backbone.Layout.extend
    template: "#floatLayout"
    initialize: () ->
      # TODO: Separate tour from welcomeview so we don't have to instantiate it at all if the cookie exists

      welcome = new WelcomeView()
      if not $.cookie('welcomed')
        this.insertView('#welcome', welcome)
        $.cookie('welcomed', true)

    views: 
      '#header': new HeaderView()
      'map': new MapView()
      '#legend': new LegendView()
      '#share': new ShareView()

  layout = app.layout = new FloatLayout()
  layout.$el.appendTo('#main')

  layout.render()

  # TODO: Separate tour from welcomeview so we don't have to instantiate it at all if the cookie exists
    
  