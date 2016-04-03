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
        if app.map.marker
          app.map.removeLayer(app.map.marker)
        marker = app.map.marker = L.marker(latLng, { icon: defaultIcon }).addTo(app.map)
        if $("button.navbar-toggle").is(":visible")
           $("button.navbar-toggle").trigger("click")

    events: 
      "submit #search": (e) ->
        e.preventDefault()
        address = $(e.target).find('.search-input').val()
        this.getAddress address

      "submit #searchMobile": (e) ->
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
