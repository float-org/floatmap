  # View for the data that appears in the collapsable element above the legend.
  QueryView = app.QueryView = Backbone.View.extend
    template: "#queryTemplate"

    initialize: () ->
      this.model = new Query()
      this.listenTo(this.model, "change", this.render)

    serialize: () ->
      { query: this.model.attributes }

    handleQuery: (lnglat) ->
      # look through each layer in order and see if the clicked point,
      # e.latlng, overlaps with one of the shapes in it.
      i = 0
      while i < _.size(app.gjLayers)
        match = leafletPip.pointInLayer(lnglat, app.gjLayers[Object.keys(app.gjLayers)[i]], false)
        # if there's overlap, add some content to the popup: the layer name
        # and a table of attributes
        if Object.keys(app.gjLayers)[i] == 'apLayer'
          if match.length
            this.model.set({'ap': match[0].feature.properties.DN + '%↑ Annual Precipitation'})
          else 
            this.model.set({'ap': 'No average precipitation data yet.'})
        if Object.keys(app.gjLayers)[i] == 'epLayer'
          if match.length
            this.model.set({'ep': match[0].feature.properties.DN + '%↑ Storm Frequency'})
          else
            this.model.set({'ep': 'No storm frequency data yet.'})         
        i++
      return
 
    afterRender: () ->
      if JSON.stringify(this.model.defaults) != JSON.stringify(this.model.attributes)
        if not $('.legend-wrapper').hasClass('active')
          $('#legend-toggle').trigger('click')
        setTimeout () ->
          if not $('#query').hasClass('active')
            $('#query').addClass('active')
        , 200