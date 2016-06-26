# Creates tour of the Float interface, using ShepherdJS
DataTourView = app.DataTourView = Backbone.View.extend

  # Create new tour, use default Shepherd theme for now
  initialize: () ->
    # Remove existing instance of Shepherd Tour
    # TODO: Still have zombie view problem, which I *thought* LayoutManager helped with...
    if window.tour
      if app.map.marker
        app.map.removeLayer(app.map.marker)
      window.tour.complete()
    window.tour = this.tour = new Shepherd.Tour
      defaults:
        classes: 'shepherd-theme-arrows'
        scrollTo: true

  resetMapAfterTour: () ->
    if app.map.marker
      app.map.removeLayer(app.map.marker)
    if $('.active')
      $('.active').removeClass('active').promise().done () ->
        $('.legend-wrapper').addClass('invisible')
    app.map.setZoom(6)
    app.map.addLayer floods, 1
    $('#floods-switch').prop('checked',true)
    app.map.addLayer ap, 2
    $('#apLayer-switch').prop('checked',true)
    app.map.addLayer ep, 3
    $('#epLayer-switch').prop('checked',true)
    tour.complete()

  resetMapData: () ->
    if $('.active')
      $('.active').removeClass('active').promise().done () ->
        $('.legend-wrapper').addClass('invisible')
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
    $('#legend-toggle').trigger('click')

    L.Icon.Default.imagePath = "../static/img"

    # Display average precipitation layer - this sort of thing happens in tour step action methods hereafter
    $('#apLayer-switch').trigger('click')

    # Avg Precip explanation step
    this.tour.addStep 'ap-step',
      title: 'Annual Precipitation'
      text: 'The Annual Precipitation layer shows how total rain and snowfall each year is projected to grow by the 2040-2070 period.
More annual precipitation means more water going into rivers, lakes and snowbanks, a key risk factor for bigger floods.
These projections come from the National Oceanic and Atmospheric Administration (2014).'
      attachTo: '#apToggle top'
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
      attachTo: '#stormsToggle top'
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
      attachTo: '#floodZonesToggle top'
      buttons: [
        text: 'Next'
        action: tour.next
      ]

    # Display search step
    this.tour.addStep 'search-step',
      title: 'Search'
      text: 'Search for a specific address, city or landmark. Try using the search bar now to find a location you care about in the Midwest.'
      attachTo: '.search-input bottom'
      buttons: [
        text: 'Next'
        action: () ->
          setTimeout () ->
            tour.next()
          , 450
      ]

    # Display query step
    # TODO: Not totally in love w/ the animation here - play around with it some more.
    this.tour.addStep 'query-step',
      title: 'Inspect'
      text: '<p>Right click anywhere on the map to inspect the numbers for that specific place.</p><br /><p>Take a tour of some communities at high risk for worsened flooding.</p>'
      attachTo: '#query left'
      buttons: [
        text: 'Take a Tour'
        action: () ->
          latlng = [44.519, -88.019]
          app.layout.views['map'].setAddress(latlng, 13)
          if app.map.marker
            app.map.removeLayer(app.map.marker)
          marker = app.map.marker = L.marker(latlng, { icon: defaultIcon }).addTo(app.map)
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
          app.layout.views['map'].setAddress(latlng, 13)
          if app.map.marker
            app.map.removeLayer(app.map.marker)
          marker = app.map.marker = L.marker(latlng, { icon: defaultIcon }).addTo(app.map)
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
          app.layout.views['map'].setAddress([42.73591782230738, -84.48997020721437], 13)
          if app.map.marker
            app.map.removeLayer(app.map.marker)
          marker = app.map.marker = L.marker(latlng, { icon: defaultIcon }).addTo(app.map)
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
          app.layout.views['map'].setAddress([41.7348457153312, -90.310], 13)
          if app.map.marker
            app.map.removeLayer(app.map.marker)
          marker = app.map.marker = L.marker(latlng, { icon: defaultIcon }).addTo(app.map)

          tour.next()
      ,
        text: 'Stop Tour'
        action: this.resetMapAfterTour
      ]

    this.tour.addStep 'map-quadcities',
      title: 'Quad Cities Nuclear Generating Station'
      text: 'Power plants, including nuclear plants like the one here, are frequently built on riverbanks to use water for cooling. Larger, more frequent future floods could place these power plants and their communities at risk.'
      attachTo: '.leaflet-marker-icon bottom'
      buttons: [
        text: 'Stop Tour'
        action: this.resetMapAfterTour
      ]

    this.tour.start()

module.exports = DataTourView
