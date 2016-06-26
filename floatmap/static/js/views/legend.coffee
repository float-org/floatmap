LegendView = app.LegendView = Backbone.View.extend
  template: "#legendTemplate"

  events:
    "click #legend-toggle": (e) ->
      if $('.legend-wrapper').hasClass('active') # i.e. if panel is open
        $('.legend-wrapper').addClass('invisible')
        setTimeout () ->
          $('.legend-wrapper, #legend-toggle, #legend').removeClass('active')
        , 1
      else
        $('.legend-wrapper, #legend-toggle, #legend').addClass('active')
        setTimeout () ->
          $('.legend-wrapper').removeClass('invisible')
        , 150


    "click .switch-container": (e) ->
      e.stopPropagation()
      map = app.map
      name = $(e.currentTarget).find('.ios-switch').data('layer')
      layer = app.layers[name]
      current_ap = app.layers['apLayer']
      current_ep = app.layers['epLayer']

      # This is super gross and only has to be this complicated because geoJson layers
      # do not seem to respect zIndex, even though you can set a zIndex on them when
      # adding them to the map.  Grrrrr.


      if $(e.currentTarget).find('.ios-switch').is(':checked')
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

    if $("button.navbar-toggle").is(":visible")
    else
      $('.legend-wrapper, #legend-toggle, #legend').addClass('active')
      setTimeout () ->
          $('.legend-wrapper').removeClass('invisible')
        , 150

    # Create toggle switches oyyyy

    switches = document.querySelectorAll('input[type="checkbox"].ios-switch')

    for i in switches
      div = document.createElement('div')
      div.className = 'switch'
      i.parentNode.insertBefore(div, i.nextSibling)

    # ToDo: Worth transferring this HTML to the template at some point?
    self.$el.find(".apRange").append "<div class='ap-values'></div>"
    $(apGrades).each (index) ->
      apValue = $("<div><i style=\"background:" + app.getColor("ap", this) + "\"></i></div>")
      if index % 4 is 0
        textNode = "<span>+" + this + "%</span>"
        apValue.append textNode
      self.$el.find(".ap-values").append apValue
    self.$el.find(".apRange").append "<div class='ap-arrow'></div>"
    self.$el.find(".apRange").append "<span class='ap-text'>Increasing Average Precipitation</span>"
    # TODO: Why do I have to do this at all?
    self.$el.appendTo(layout.$el.find('#legend'))

    $('#legend').on("click", (e) ->
      if $('#legend').hasClass('active')
        return
      else
        $('.legend-wrapper, #legend-toggle, #legend').addClass('active')
        setTimeout () ->
          $('.legend-wrapper').removeClass('invisible')
        , 150)

    if $.cookie('welcomed')
      $('#floods-switch').prop('checked',true)
      $('#apLayer-switch').prop('checked',true)
      $('#epLayer-switch').prop('checked',true)

    $("[data-toggle=tooltip]").tooltip({ placement: 'left'})

module.exports = LegendView
