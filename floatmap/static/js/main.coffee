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

# A mediator pattern allows our different Views to publish and subscribed to a shared, but independent, set of events.
# Read more at http://addyosmani.com/largescalejavascript/#mediatorpattern
Mediator = () ->
  subscribe = (channel, fn) ->
    if not this.channels[channel] 
      this.channels[channel] = []
      this.channels[channel].push({ context: this, callback: fn })
      this
  
  publish = (channel) ->
    if not this.channels[channel]
      return false
    args = Array.prototype.slice.call(arguments, 1);
    i = 0
    l = this.channels[channel].length
    while i < l
      subscription = this.channels[channel][i]
      subscription.callback.apply subscription.context, args
      i++
    this

  {
    channels: {},
    publish: publish,
    subscribe: subscribe,
    installTo: (obj) ->
        obj.subscribe = subscribe;
        obj.publish = publish;
  }

$ ->

  # App namespace
  app = window.app = ( window.app || {} );

  # Our layers object, which will contain all of the data layers
  layers = app.layers = []

  # Create an instance of the Mediator class so we can pass things around views
  mediator = app.mediator = new Mediator()

  # Accepts a data type and a data value (e.g NOAA Ext. Precipitation DN value)
  # Returns an ID which corresponds to one of four SVG patterns
  app.getPattern = (type, d) ->
    if type == 'ep'
      if d is null
        return false
      if d <= 12
        pattern = 'tiny dots' 
      else if d >= 12 and d <= 24
        pattern = 'small dots' 
      else if d >= 25 and d <= 35
        pattern = 'large dots' 
      else if d >= 36 and d <= 100
        pattern = 'huge dots' 
      return pattern

  # Accepts a data type and a data value (e.g NOAA Ext. Precipitation DN value)
  # Creates a gradient from the start color and end color in setSpectrum
  # Returns a hex Value that corresponds to the color for that particular number/data value
  app.getColor = (type, d) ->
    if type == 'ap'
      rainbow = new Rainbow
      rainbow.setSpectrum '#94FFDB', '#1900FF'
      rainbow.setNumberRange 0, 12
      '#' + rainbow.colourAt(d)

  # Simple config for spin.js spinner that loads when we query Elasticsearch
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
    spinner = new Spinner(opts).spin(target)


  Backbone.Layout.configure
    manage: true

  app.AvgPrecipCollection = GeoCollection.extend
    url: 'static/ap/noaa_avg_precip.geojson',

  app.ExtPrecipCollection = GeoCollection.extend
    url: 'static/ep/noaa_ex_precip.geojson',

  HeaderView = app.HeaderView = Backbone.View.extend
    template: "#headerTemplate"

    getAddress: (address) ->
      g = new google.maps.Geocoder()
      g.geocode { address: address }, (results, status) ->
        latLng = [ results[0].geometry.location.lat(), results[0].geometry.location.lng() ]
        # Sends latLng to mediator, which will handle talking to the map.
        mediator.publish('searched', latLng);

    events: 
      "submit #search": (e) ->
        e.preventDefault()
        address = $(e.target).find('.search-input').val()
        this.getAddress address


  MapView = app.MapView = Backbone.View.extend
    template: "#mapTemplate"
    el: false

    # Wish I could use the built in Backbone stuff... 

    # When invoked, creates a new Popup w/ appropriate 
    # Elasticsearch queried data and renders to the appropriate
    # lat/lng

    renderPopup: (coordinates) ->
      this.popup = new PopupView({coordinates: coordinates})
      this.popup.render()

    setEvents: () ->
      # For Debugging
      # app.map.on 'click', (e) ->
      #    alert("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
      
      self = this
      app.map.on 'zoomstart', (e) ->
        self.previousZoom = app.map.getZoom()

      # app.map.on 'mousemove', (e) ->
      #   if app.map.getZoom() == 15
      #     console.log e
      #     self.renderPopup e.latlng

      app.map.on 'zoomend', (e) ->
        map = app.map
        map.removeLayer window.marker if map.getZoom() < this.previousZoom and this.previousZoom == 15

    # Fairly self-descriptive
    addLayer: (layer, zIndex) ->
      layer.setZIndex(zIndex).addTo(app.map)

    # Prepare popup to show elasticsearch queries
    setAddress: (latlng) ->
      app.map.setView(latlng, 18)
      app.layout.views['map'].renderPopup latlng

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


    initialize: () ->
      # Subscribe setAddress method to the mediator so the nav
      # can access this method when an address is searched.
      self = this
      mediator.subscribe('searched', self.setAddress)

    renderTemplate: () -> 
      # Path to Base layer (no labels)
      baseURL = '//{s}.tiles.mapbox.com/v3/floatmap.2ce887fe/{z}/{x}/{y}.png'

      # Path to Base layer labels, overlaid last
      labelsURL = '//{s}.tiles.mapbox.com/v3/floatmap.2b5f6c80/{z}/{x}/{y}.png'

      # Instantiate map if we haven't
      if not app.map
        map = app.map = new L.Map('map', {zoomControl: false}).setView([43.05358653605547, -89.2815113067627], 6)
      
      # Create new SVG renderer and add to Tile pane, so we can style GeoJSON like other layers
      map.renderer = L.svg({pane:'tilePane'}).addTo(map);
      
      # We're only dealing with the Midwest for now, so lets bound our 
      # tile layer queries.
      southWest = L.latLng(37.92686760148135, -95.88867187500001)
      northEast = L.latLng(48.60385760823255, -80.72753906250001)
      floodBounds = L.latLngBounds(southWest, northEast)
      
      # Create our layers
      base = app.layers['base'] = L.tileLayer(baseURL, {pane: 'tilePane', maxZoom: 15, minZoom: 5});
      floods = app.layers['floods'] = L.tileLayer('/static/nfhl_tiles/{z}/{x}/{y}.png', {bounds: floodBounds, pane: 'tilePane', maxZoom: 15, minZoom: 5});
      labels = app.layers['labels'] = L.tileLayer(labelsURL, {pane: 'tilePane', maxZoom: 15, minZoom: 5})
      ap = this.makeGeoJSONLayer(window.apData, 'ap')
      ep = this.makeGeoJSONLayer(window.epData, 'ep')
      
      # ...and then append them to the map, in order!
      this.addLayer base, 0
      this.addLayer floods, 1
      this.addLayer ap, 2
      this.addLayer ep, 3
      this.addLayer labels, 4

      # Then we add zoom controls and finally set off event listeners
      map.addControl L.control.zoom(position: "bottomleft")
      this.setEvents()

  PopupView = app.PopupView = Backbone.View.extend
    initialize: () ->
      map = app.map
      coordinates = this.coordinates = this.options.coordinates
      map.removeLayer(window.marker) if window.marker?   
      window.marker = L.marker(coordinates).addTo(map)
      popup = this.popup = new L.Popup(minWidth: 350)
      popup.setLatLng coordinates
      window.marker.bindPopup(popup).openPopup popup
      this.serialize()

    serialize: () ->
      self = this

      # TODO: Explain why it's complicated like this.
      lng = this.coordinates['lng'] || this.coordinates[1]
      lat = this.coordinates['lat'] || this.coordinates[0]

      setTimeout () ->
        $.post("get_score/ap/",
          lng: lat
          lat: lng
        ).done (data) ->
          noaaApScore = data
          self.renderTemplate(noaaApScore)
      , 200

      app.createSpinner ".leaflet-popup-content-wrapper"

    renderTemplate: (score) ->
      popupContent = "<p>This address has a high risk of of more floods due to climate change</p><ul class='metrics'></ul>"
      this.popup.setContent popupContent
      if score > 0
        apData = "<li><label>Annual Precipitation:</label><span>" + score + "% Increase</span><a href='#''>source</a></li>"
      else
        apData = "<li><label>Annual Precipitation:</label><span>No Data Yet</span><a href='#''>source</a></li>"
      epData = "<li><label>Storm Frequency:</label><span>25% Increase</span><a href='#'>source</a></li>"
      fhData = "<li><label>Flood Hazard Zone:</label> <span>Extreme</span> <a href='#'>source</a></li>"
      $(".metrics").append(apData).append(epData).append(fhData)
      window.spinner.stop()

  LegendView = app.LegendView = Backbone.View.extend
    template: "#legendTemplate"  

    events:
      "click .onoffswitch-checkbox": (e) ->
        e.stopPropagation()
        map = app.map
        name = $(e.currentTarget).data('layer')
        layer = app.layers[name]
        apLayer = app.layers['apLayer']
        epLayer = app.layers['epLayer']

        if $(e.currentTarget).is(':checked')
          if not app.map.hasLayer(layer)
            # If we're zoomed in to higher levels, make sure we 
            # build the layers the appropriate way.  Only matters
            # when redrawing epLayer since it's supposed to be
            # on bottom. 
            if app.map.getZoom() >= 11 and name == 'epLayer'
              app.map.removeLayer apLayer
              map.addLayer epLayer, 3
              if $('input[data-layer=apLayer]').prop('checked')
                map.addLayer apLayer 4
            else if app.map.getZoom() <= 10 and name == 'apLayer'
              if map.hasLayer(epLayer)
                app.map.removeLayer epLayer
                map.addLayer apLayer
                map.addLayer epLayer
              else
                map.addLayer app.layers['apLayer']
            else
              map.addLayer layer
        else 
          map.removeLayer layer if map.hasLayer(layer)
            
    afterRender: () ->
      self = this
      apGrades = _.range(0,13,1)  
      labels = []
      
      # ToDo: Worth transferring this HTML to the template at some point?
      $(apGrades).each (index) ->
        apValue = $("<div><i style=\"background:" + app.getColor("ap", this) + ";\"></i></div>")
        if index % 4 is 0
          textNode = "<span>+" + this + "%</span>"
          apValue.append textNode
        self.$el.find(".apRange").append apValue
        
      self.$el.find(".apRange").append "<div class='bottom-line'>increasing annual precipitation</div>"

      # TODO: Why do I have to do this at all?
      self.$el.appendTo(layout.$el.find('#legend')) 
      $("[data-toggle=tooltip]").tooltip({ placement: 'right'});

  FloatLayout = app.FloatLayout = Backbone.Layout.extend
    template: "#floatLayout"
    views: 
      'header': new HeaderView()
      'map': new MapView()
      'legend': new LegendView()

  layout = app.layout = new FloatLayout()
  layout.$el.appendTo('#main')

  layout.render()
  