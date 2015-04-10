###
 TO DO
  - Move GeoModel code to separate file
  - Separate out code into better named methods
  - Fix tooltips not rendering
  - Test popup w/ Elasticsearch
###

GeoModel = L.GeoModel = Backbone.Model.extend(
  keepId: false
  set: (key, val, options) ->
    args = undefined
    attrs = undefined
    _attrs = undefined
    geometry = undefined
    args = arguments
    # Handle both `"key", value` and `{key: value}` -style arguments.
    if typeof key == 'object'
      attrs = key
      options = val
    # Handle GeoJSON argument.
    if attrs and attrs['type'] and attrs['type'] == 'Feature'
      _attrs = _.clone(attrs['properties']) or {}
      # Clone the geometry attribute.
      geometry = _.clone(attrs['geometry']) or null
      if geometry
        geometry.coordinates = geometry['coordinates'].slice()
      _attrs['geometry'] = geometry
      if attrs[@idAttribute]
        _attrs[@idAttribute] = attrs[@idAttribute]
      args = [
        _attrs
        options
      ]
    Backbone.Model::set.apply this, args

  toJSON: (options) ->
    attrs = undefined
    props = undefined
    geometry = undefined
    options = options or {}
    attrs = _.clone(@attributes)
    props = _.omit(attrs, 'geometry')
    # Add model cid to internal use.
    if options.cid
      props.cid = @cid
    # Clone the geometry attribute.
    geometry = _.clone(attrs['geometry']) or null
    if geometry
      geometry.coordinates = geometry['coordinates'].slice()
    json = 
      type: 'Feature'
      geometry: geometry
      properties: props
    if @keepId
      json[@idAttribute] = @id
    json)

GeoCollection = L.GeoCollection = Backbone.Collection.extend(
  model: GeoModel
  reset: (models, options) ->
    # Accpets FeatureCollection GeoJSON as `models` param.
    if models and !_.isArray(models) and models.features
      models = models.features
    Backbone.Collection::reset.apply this, [
      models
      options
    ]
  toJSON: (options) ->
    features = Backbone.Collection::toJSON.apply(this, arguments)
    {
      type: 'FeatureCollection'
      features: features
    })

Query = Backbone.Model.extend
  defaults:
    ap: 0
    ep: 0
    flood: 0
    overall_risk: 'unknown'

  url: '/get_queries/'

$ ->

  # App namespace
  app = window.app = ( window.app || {} )

  # Our layers object, which will contain all of the data layers
  # TODO: This seems like something Leaflet should be able to handle but I don't know...
  layers = app.layers = []

  # Accepts a data type and a data value (e.g NOAA Ext. Precipitation DN value)
  # Returns a class which corresponds to one of four SVG patterns, which inherit styles from CSS
  app.getPattern = (type, d) ->
    if type == 'ep'
      if d is null
        return false
      pattern = 'dots '
      if d <= 22
        pattern += 'low-mid' 
      else if d >= 23 and d <= 33
        pattern += 'mid-high' 
      else if d >= 34 and d <= 44
        pattern += 'high-extreme' 
      else if d >= 45 and d <= 55
        pattern += 'extreme-severe' 
      return pattern

  # Accepts a data type (e.g. 'ex precip, avg precip') and a data value (e.g 'DN')
  # Creates a gradient from the start color and end color using setSpectrum
  # Returns a hex Value that corresponds to the color for that particular number/data value
  app.getColor = (type, d) ->
    if type == 'ap'
      rainbow = new Rainbow
      rainbow.setSpectrum '#94FFDB', '#1900FF' # Probably just need to set once
      rainbow.setNumberRange 0, 12
      '#' + rainbow.colourAt(d)

  # Simple config for spin.js spinner that loads when we query Elasticsearch
  # Question: Is this reeeeally necessary?
  app.createSpinner = (element) ->
    opts =
      lines: 11
      length: 4
      width: 2
      radius: 7
      corners: 0.9
      rotate: 0
      direction: 1
      color: "#000"
      speed: 1
      trail: 60
      shadow: false
      hwaccel: false
      className: "spinner"
      zIndex: 2e9
      top: "50%"
      left: "50%"

    target = $(element)[0]
    window.spinner = new Spinner(opts).spin(target)

  # Option so that all created views are managed by LayoutManager (i.e. they behave like Layout)
  Backbone.Layout.configure
    manage: true

  # Create a new collection for Average Precip data
  app.AvgPrecipCollection = GeoCollection.extend
    url: 'static/ap/noaa_avg_precip.geojson',

  # Create a new collection for Extreme Precip data
  app.ExtPrecipCollection = GeoCollection.extend
    url: 'static/ep/noaa_ex_precip.geojson',

  # Header View handles behavior for the header, including search and nav.
  HeaderView = app.HeaderView = Backbone.View.extend

    # As defined in map.html
    template: "#headerTemplate"

    # GeoCode whatever we put into the search input, update the location of the map by calling MapView.setAddress
    # from our layout
    getAddress: (address) ->
      g = new google.maps.Geocoder()
      g.geocode { address: address }, (results, status) ->
        latLng = [ results[0].geometry.location.lat(), results[0].geometry.location.lng() ]
        app.layout.views['map'].setAddress(latLng, 15)

    events: 
      "submit #search": (e) ->
        e.preventDefault()
        address = $(e.target).find('.search-input').val()
        this.getAddress address

      # TODO: Currently, we are blessed with Bootstrap Modal working properly outside of Backbone.  I should probably
      # make an event that creates an AboutModalView at some point just so it follows our convention.

      # Start the tour from the nav
      "click #tourLink": (e) ->
        e.preventDefault()
        dataTour = new DataTourView()
        dataView = this.insertView('#dataTour', dataTour)
        dataView.render()

  # Creates tour of the Float interface, using ShepherdJS
  DataTourView = app.DataTourView = Backbone.View.extend

    # Create new tour, use default Shepherd theme for now
    initialize: () ->
      # Remove existing instance of Shepherd Tour
      # TODO: Still have zombie view problem, which I *thought* LayoutManager helped with...
      if window.tour
        window.tour.complete()
      window.tour = this.tour = new Shepherd.Tour
        defaults: 
          classes: 'shepherd-theme-arrows'
          scrollTo: true

    resetMapAfterTour: () ->
      if $('.active-query')
        $('.active-query').removeClass('active-query')
      app.map.setZoom(6)
      app.map.addLayer floods, 1
      $('#floods-switch').prop('checked',true)
      app.map.addLayer ap, 2
      $('#apLayer-switch').prop('checked',true)
      app.map.addLayer ep, 3
      $('#epLayer-switch').prop('checked',true)
      tour.complete()

    resetMapData: () ->
      if $('.active-query')
        $('.active-query').removeClass('active-query')
      for layer in [window.ap, window.ep, window.floods]
        app.map.removeLayer(layer)
      $('#floods-switch').prop('checked',false)
      $('#apLayer-switch').prop('checked',false)
      $('#epLayer-switch').prop('checked',false)

    # Once view renders, add steps to tour and start it up.
    afterRender: () ->   

      app.map.setZoom(6)
      this.resetMapData()
      $('#welcomeModal').modal('hide')

      # Display average precipitation layer - this sort of thing happens in tour step action methods hereafter
      $('#apLayer-switch').trigger('click')

      # Avg Precip explanation step
      this.tour.addStep 'ap-step',
        title: 'Annual Precipitation'
        text: 'The Annual Precipitation layer shows how total rain and snowfall each year is projected to grow by the 2040-2070 period. 
More annual precipitation means more water going into rivers, lakes and snowbanks, a key risk factor for bigger floods.
These projections come from the National Oceanic and Atmospheric Administration (2014).'
        attachTo: '#apLegendContainer top'
        buttons: [
          text: 'Next'
          action: () ->
            $('#epLayer-switch').trigger('click')
            tour.next()
        ]

      # Ext Precip explanation step
      this.tour.addStep 'ep-step',
        title: 'Storm Frequency'
        text: 'The Storm Frequency layer shows how days with heavy rain or snow (over 1 inch per day) are projected to come more often by the 2040-2070 period. 
More storm frequency means more rapid surges of water into rivers and lakes, a key risk factor for more frequent flooding.
These projections also come from the National Oceanic and Atmospheric Administration (2014).'
        attachTo: '#epLegendContainer top'
        buttons: [
          text: 'Next'
          action: () ->
            $('#floods-switch').trigger('click')
            tour.next()
        ]

      # Floods explanation step
      this.tour.addStep 'flood-step',
        title: 'Flood Zones'
        text: 'The Flood Zones show the areas that already are at major risk for flooding, based on where floods have historically reached. 
If floods become larger and more frequent, many neighboring areas to these historical flood zones are likely to start experience flooding. 
This information comes from the Federal Emergency Management Administration (2014).'
        attachTo: '#floodsLegendContainer top'
        buttons: [
          text: 'Next'
          action: tour.next
        ]

      # Display search step
      this.tour.addStep 'search-step',
        title: 'Search'
        text: 'Use the search bar to see the risks for a specific location. Try using the search bar now to find a location you care about in the Midwest.'
        attachTo: '.search-input bottom'
        buttons: [
          text: 'Next'
          action: () ->
            $('#queryToggle').trigger('click')
            setTimeout () -> 
              tour.next()
            , 450
        ]

      # Display query step
      # TODO: Not totally in love w/ the animation here - play around with it some more.
      this.tour.addStep 'query-step',
        title: 'Query'
        text: 'Right click anywhere on the map to see the numbers for that specific place, or take a tour of some communities at high risk for worsened flooding.'
        attachTo: '#queryContent left'
        buttons: [
          text: 'Take a Tour'
          action: () -> 
            latlng = [44.519, -88.019]
            app.map.setView(latlng, 15)
            if app.map.marker
              app.map.removeLayer(app.map.marker)
            marker = app.map.marker = L.marker(latlng).addTo(app.map)
            tour.next()
        , 
          text: 'Stop Tour'
          action: this.resetMapAfterTour
        ]

      # The following steps show particular regions on the map
      this.tour.addStep 'map-lambeau',
        title: 'Green Bay, WI'
        text: 'The home of the Packers has a large neighborhood of paper plants and homes at high risk of worsened flooding, 
        with storm days increasing nearly 40% and annual precipitation rising 10% in the next few decades.'
        attachTo: '.leaflet-marker-icon left'
        buttons: [
          text: 'Continue'
          action: () ->
            latlng = [43.1397, -89.3375]
            app.map.setView(latlng, 15)
            if app.map.marker
              app.map.removeLayer(app.map.marker)
            marker = app.map.marker = L.marker(latlng).addTo(app.map)
            tour.next()
        , 
          text: 'Stop Tour'
          action: this.resetMapAfterTour
        ]

      this.tour.addStep 'map-dane',
        title: 'Madison, WI Airport'
        text: 'Airports are often built on flat areas near rivers, placing them at serious risk of flooding, like Madison’s main airport, serving 1.6 million passengers per year.'
        attachTo: '.leaflet-marker-icon left'
        buttons: [
          text: 'Continue'
          action: () ->
            latlng = [42.732072157891224, -84.50576305389404]
            app.map.setView([42.73591782230738, -84.48997020721437], 15)
            if app.map.marker
              app.map.removeLayer(app.map.marker)
            marker = app.map.marker = L.marker(latlng).addTo(app.map)
            tour.next()
        , 
          text: 'Stop Tour'
          action: this.resetMapAfterTour
        ]

      this.tour.addStep 'map-lansing',
        title: 'Lansing, MI'
        text: 'A large stretch of downtown businesses and homes are at risk of worsened flooding, as well as part of the Michigan State campus.'
        attachTo: '.leaflet-marker-icon left'
        buttons: [
          text: 'Continue'
          action: () ->
            latlng = [41.726, -90.310]
            app.map.setView([41.7348457153312, -90.310], 15)
            if app.map.marker
              app.map.removeLayer(app.map.marker)
            marker = app.map.marker = L.marker(latlng).addTo(app.map)
            tour.next()
        , 
          text: 'Stop Tour'
          action: this.resetMapAfterTour
        ]

      this.tour.addStep 'map-quadcities',
        title: 'Quad Cities Nuclear Generating Station'
        text: 'Power plants, including nuclear plants like the one here, are frequently built on riverbanks to use water for cooling. Larger, more frequent future floods could place these power plants and their communities at risk.'
        attachTo: '.leaflet-marker-icon left'
        buttons: [
          text: 'Stop Tour'
          action: this.resetMapAfterTour
        ]

      this.tour.start()

  # Display welcome modal - should only appear if a cookie hasn't been set in the browser
  WelcomeView = app.WelcomeView = Backbone.View.extend

    template: "#welcomeTemplate"

    events: 
      'click #startDataTour': (e) ->
        e.preventDefault()
        dataTour = new DataTourView()
        dataView = this.insertView('#dataTour', dataTour)
        dataView.render()

      'shown.bs.modal #welcomeModal': (e) ->
        this.reposition()

      'click #closeModal': (e) ->
        if $('.active-query')
          $('.active-query').removeClass('active-query')
        app.map.addLayer floods, 1
        $('#floods-switch').prop('checked',true)
        app.map.addLayer ap, 2
        $('#apLayer-switch').prop('checked',true)
        app.map.addLayer ep, 3
        $('#epLayer-switch').prop('checked',true)

    initialize: (e) ->
      self = this
      $(window).on 'resize', (e) ->
        self.reposition()

    # Kick off the modal once the view has been created
    afterRender: () ->
      $('#welcomeModal').modal({
        backdrop: 'static'
        keyboard: true
      }, 'show')

    # Keeps the modal centered (more or less)
    reposition: () ->
      modal = this.$el
      dialog = modal.find('.modal-dialog')
      modal.css('display', 'block')
      # Dividing by two centers the modal exactly, but dividing by three 
      # or four works better for larger screens.
      dialog.css("margin-top", Math.max(0, ($(window).height() - dialog.height()) / 2))
      
  MapView = app.MapView = Backbone.View.extend
    template: "#mapTemplate"
    el: false

    setEvents: () ->
      # For Debugging
      # app.map.on 'click', (e) ->
      #    alert("Lat, Lng : " + e.latlng.lat + ", " + e.latlng.lng)
      
      self = this

      # When a user right clicks, trigger a query in Elasticsearch for the coords at the click.
      app.map.on 'contextmenu', (e) ->
        latLng = [e.latlng.lat, e.latlng.lng]
        app.layout.views['map'].setAddress(latLng, app.map.getZoom())

      # When zoom begins, get the current zoom and cache for later.
      app.map.on 'zoomstart', (e) ->
        self.previousZoom = app.map.getZoom()

      # When zoom is over, remove marker if we're leaving the max zoom layer.
      app.map.on 'zoomend', (e) ->
        map = app.map
        map.removeLayer window.marker if map.getZoom() < this.previousZoom and this.previousZoom == 15

    # Fairly self-descriptive
    addLayer: (layer, zIndex) ->
      layer.setZIndex(zIndex).addTo(app.map)

    setAddress: (latlng, zoom) ->
      app.map.setView(latlng, zoom)
      # Note that GeoJSON expects Longitude first (as x) and Latitude second (as y), so we have to switch the order
      lnglat = [latlng[1], latlng[0]]
      app.layout.views['#legend'].views['#query'].getQuery(lnglat)

    # Based on data type, creates geoJSON layer
    # and styles appropriately, based on features
    makeGeoJSONLayer: (data, type) ->
      self = this
      if type == 'ap'
        layer = app.layers['apLayer'] = L.geoJson data,
          renderer: app.map.renderer,
          style: (feature, layer) ->
            className: 'ap'
            color: app.getColor("ap", feature.properties.DN)
        
      else if type == 'ep'
        layer = app.layers['epLayer'] = L.geoJson data,
          renderer: app.map.renderer,
          style: (feature, layer) ->
            className: app.getPattern("ep", feature.properties.DN) + " ep"
          filter: (feature, layer) ->
            if feature.properties.DN is null
              return false
            else
              return true

      layer

    renderTemplate: () -> 
      # Path to Base layer (no labels)
      baseURL = '//{s}.tiles.mapbox.com/v3/floatmap.2ce887fe/{z}/{x}/{y}.png'

      # Path to Base layer labels, overlaid last
      labelsURL = '//{s}.tiles.mapbox.com/v3/floatmap.2b5f6c80/{z}/{x}/{y}.png'

      # Instantiate map if we haven't
      if not app.map
        map = app.map = new L.Map('map', {zoomControl: false}).setView([43.05358653605547, -89.2815113067627], 6)
      
      # Create new SVG renderer and add to Tile pane, so we can work with GeoJSON like other layers
      map.renderer = L.svg({pane:'tilePane'}).addTo(map)
      
      # We're only dealing with the Midwest for now, so bound our 
      # tile layer queries.
      # TODO: Determine a better way to have a more precise set of bounds
      
      # Create our layers
      base = window.base = app.layers['base'] = L.tileLayer(baseURL, {pane: 'tilePane', maxZoom: 15, minZoom: 5})
      floods = window.floods = app.layers['floods'] = L.tileLayer('/static/nfhl_tiles/{z}/{x}/{y}.png', {pane: 'tilePane', maxZoom: 15, minZoom: 5, errorTileUrl: '#'})
      labels = window.labels = app.layers['labels'] = L.tileLayer(labelsURL, {pane: 'tilePane', maxZoom: 15, minZoom: 5})
      
      ap = window.ap = this.makeGeoJSONLayer(window.apData, 'ap')
      ep = window.ep = this.makeGeoJSONLayer(window.epData, 'ep')
      
      # ...and then append them to the map, in order!
      # TODO: Why doesn't zindex work with GeoJSON layers?
      this.addLayer base, 0
      if $.cookie('welcomed')
        this.addLayer floods, 1
        this.addLayer ap, 2
        this.addLayer ep, 3
      
      this.addLayer labels, 4
        
      # Then we add zoom controls and finally set off event listeners
      map.addControl L.control.zoom(position: "bottomleft")
      this.setEvents()

  # View for the data that appears in the collapsable element above the legend.
  QueryView = app.QueryView = Backbone.View.extend
    template: "#queryTemplate"

    events:
      "click #queryToggle": (e) -> 
        app.layout.views['#legend'].$el.toggleClass('active-query')

    initialize: () ->
      this.model = new Query()
      this.listenTo(this.model, "change", this.render)

    serialize: () ->
      { query: this.model.attributes }

    getQuery: (lnglat) ->
      spinner = app.createSpinner "#queryContent"
      self = this   

      this.model.fetch
        data: {
          lng:lnglat[0],
          lat:lnglat[1]
        },
        type: 'POST',
        success: (model, response) -> 
          setTimeout () ->
            app.layout.views['#legend'].$el.addClass('active-query')
          , 100
          spinner.stop()
        error: (model, response) -> 
          spinner.stop()
        complete: (model, response) -> 
          spinner.stop()

  LegendView = app.LegendView = Backbone.View.extend
    template: "#legendTemplate"  

    events:
      "click #legend": (e) -> e.stopPropagation()
      "click .onoffswitch-checkbox": (e) ->
        e.stopPropagation()
        map = app.map
        name = $(e.currentTarget).data('layer')
        layer = app.layers[name]
        current_ap = app.layers['apLayer']
        current_ep = app.layers['epLayer']

        # This is super gross and only has to be this complicated because GeoJSON layers
        # do not seem to respect zIndex, even though you can set a zIndex on them when 
        # adding them to the map.  Grrrrr.
        if $(e.currentTarget).is(':checked')
          if layer == current_ap
            if map.hasLayer(current_ep)
                map.removeLayer current_ap
                map.removeLayer current_ep
                map.addLayer window.ap, 2
                map.addLayer window.ep, 3
            else
              map.addLayer window.ap, 2
          else if layer == current_ep
            map.addLayer(window.ep)
          else
            map.addLayer(layer)
        else 
          map.removeLayer layer if map.hasLayer(layer)
    
    #Query popup box as a subview  
    views: 
      '#query': new QueryView()

    afterRender: () ->
      self = this
      apGrades = _.range(0,13,1)  
      labels = []
      
      # ToDo: Worth transferring this HTML to the template at some point?
      $(apGrades).each (index) ->
        apValue = $("<div><i style=\"background:" + app.getColor("ap", this) + "\"></i></div>")
        if index % 4 is 0
          textNode = "<span>+" + this + "%</span>"
          apValue.append textNode
        self.$el.find(".apRange").append apValue
        
      self.$el.find(".apRange").append "<div class='bottom-line'>increasing annual precipitation</div>"

      # TODO: Why do I have to do this at all?
      self.$el.appendTo(layout.$el.find('#legend')) 

      if $.cookie('welcomed')
        $('#floods-switch').prop('checked',true)
        $('#apLayer-switch').prop('checked',true)
        $('#epLayer-switch').prop('checked',true)

      $("[data-toggle=tooltip]").tooltip({ placement: 'right'})

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

  layout = app.layout = new FloatLayout()
  layout.$el.appendTo('#main')

  layout.render()

  $(window).load () ->
     # TODO: Separate tour from welcomeview so we don't have to instantiate it at all if the cookie exists
    $("img").each () ->
      $this = $(this)
      this.onerror = () ->
        $this.hide()
  