MapView = app.MapView = Backbone.View.extend
    template: "#mapTemplate"
    el: false

    initialize: () ->
      # Our layers object, which will contain all of the data layers
      # TODO: This seems like something Leaflet should be able to handle but I don't know...
      layers = app.layers = {}
      gjLayers = app.gjLayers = {}

    setEvents: () ->
      # For Debugging
      # app.map.on 'click', (e) ->
      #    alert("Lat, Lng : " + e.latlng.lat + ", " + e.latlng.lng)
      
      self = this

      # When a user right clicks, trigger a query in Elasticsearch for the coords at the click.
      app.map.on 'contextmenu', (e) ->
        if not $('.legend-wrapper').hasClass('active')
          $('#legend-toggle').trigger('click')
        app.layout.views['#legend'].views['#query'].handleQuery(e.latlng)

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
      # Note that geoJson expects Longitude first (as x) and Latitude second (as y), so we have to switch the order
      lnglat = [latlng[1], latlng[0]]
      app.layout.views['#legend'].views['#query'].handleQuery(lnglat)

    # Based on data type, creates geoJSON layer
    # and styles appropriately, based on features
    makegeoJsonLayer: (data, type) ->
      self = this
      if type == 'ap'
        layer = app.layers['apLayer'] = app.gjLayers['apLayer'] = L.geoJson data,
          renderer: app.map.renderer,
          style: (feature, layer) ->
            className: 'ap'
            color: app.getColor("ap", feature.properties.DN)
        
      else if type == 'ep'
        layer = app.layers['epLayer'] = app.gjLayers['epLayer'] = L.geoJson data,
          renderer: app.map.renderer,
          style: (feature, layer) ->
            className: app.getPattern("ep", feature.properties.DN) + " ep"
          filter: (feature, layer) ->
            if feature.properties.DN is null
              return false
            else
              return true
      else
        config = L.geoJson null,
          renderer: app.map.renderer
          style: (feature, layer) ->
            className: "no-data-yet"

        layer = app.layers[type] = omnivore.topojson(data, null, config)

    renderTemplate: () -> 
      # Path to Base layer (no labels)
      baseURL = '//{s}.tiles.mapbox.com/v3/floatmap.2ce887fe/{z}/{x}/{y}.png'

      # Path to Base layer labels, overlaid last
      labelsURL = '//{s}.tiles.mapbox.com/v3/floatmap.2b5f6c80/{z}/{x}/{y}.png'

      # Instantiate map if we haven't
      if not app.map
        southWest = L.latLng(30.85343961959182, -123.1083984375)
        northEast = L.latLng(56.12057809796008, -60.40917968750001)
        center = L.latLng(44.2205730390537, -88)
        bounds = L.latLngBounds(southWest, northEast);
        map = app.map = new L.Map('map', {maxBounds: bounds, minZoom: 5, maxZoom: 15, zoom: 6, center: center, attributionControl: false})

      
      # Create new SVG renderer and add to Tile pane, so we can work with geoJson like other layers
      map.renderer = L.svg({pane:'tilePane'}).addTo(map)
      
      # We're only dealing with the Midwest for now, so bound our 
      # tile layer queries.
      # TODO: Determine a better way to have a more precise set of bounds
      
      # Create our layers
      base = window.base = app.layers['base'] = L.tileLayer(baseURL, {pane: 'tilePane'})
      floods = window.floods = app.layers['floods'] = L.tileLayer('/static/nfhl_tiles/{z}/{x}/{y}.png', {pane: 'tilePane', errorTileUrl: 'http://i.imgur.com/aZejCgY.png'})
      labels = window.labels = app.layers['labels'] = L.tileLayer(labelsURL, {pane: 'tilePane'})
      
      ap = window.ap = this.makegeoJsonLayer(window.apData, 'ap')
      ep = window.ep = this.makegeoJsonLayer(window.epData, 'ep')
      usNoData = window.usNoData = this.makegeoJsonLayer("static/geojson/region/US_no_data_topo.geojson", 'usNoData')
      canada = window.canada = this.makegeoJsonLayer("static/geojson/regions/canada_topo.geojson", 'canada')
      mexico = window.mexico = this.makegeoJsonLayer("static/geojson/regions/mexico_topo.geojson", 'mexico')

      # ...and then append them to the map, in order!
      # TODO: Why doesn't zindex work with geoJson layers?  
      this.addLayer base, 0
      if $.cookie('welcomed')
        this.addLayer floods, 2
        this.addLayer ap, 3
        this.addLayer ep, 4
      this.addLayer labels, 5
      this.addLayer usNoData, 6
      this.addLayer canada, 6
      this.addLayer mexico, 6
      
        
      # Then we add zoom controls and finally set off event listeners
      map.addControl L.control.zoom(position: "bottomleft")
      this.setEvents()