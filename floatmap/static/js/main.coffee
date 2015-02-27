range = (start, stop, step) ->
  if arguments.length <= 1
    stop = start or 0
    start = 0
  step = step or 1
  length = Math.max(Math.ceil((stop - start) / step), 0)
  range = Array(length)
  idx = 0

  while idx < length
    range[idx] = start
    idx++
    start += step
  range

getColor = (type, d) ->
  if type == 'ap'
    rainbow = new Rainbow
    rainbow.setSpectrum '#94FFDB', '#1900FF'
    rainbow.setNumberRange 0, 12
    return '#' + rainbow.colourAt(d)
  return

getPattern = (type, d) ->
  if type == 'ep'
    return if d >= 42 then 'orangest dots' else if d >= 32 then 'orangerer dots' else if d >= 22 then 'oranger dots' else 'orange dots'
  return

  ### Builds toggleable tile layer ###

addLayer = (layer, name, zIndex, url) ->
  layer.setZIndex(zIndex).addTo Map
  if name != 'base'
    addLayerToggleToLegend layer, name
  return

addLayerToggleToLegend = (layer, name) ->
  # Create a simple layer switcher that
  # toggles layers on and off.
  template = $('<div class="onoffswitch"><input type="checkbox" name=' + name + '-switch" class="onoffswitch-checkbox" data-layer=' + name + ' id="' + name + '-switch" checked><label class="onoffswitch-label" for="' + name + '-switch"><span class="onoffswitch-inner"></span><span class="onoffswitch-switch"></span></label></div>')
  $('.legend div[data-layer=' + name + '] .legend-panel').append template
  layerToggle = $(template).find('input')
  layerToggle.on 'click', (event) ->
    event.stopPropagation()
    if $(this).is(':checked')
      if !Map.hasLayer(layer)
        # If we're zoomed in to higher levels, make sure we 
        # build the layers the appropriate way.  Only matters
        # when redrawing epLayer since it's supposed to be
        # on bottom. 
        if Map.getZoom() >= 11 and name == 'epLayer'
          Map.removeLayer apLayer
          $('.dots').attr 'class', (index, classNames) ->
            classNames + ' behind'
          $('.apRange > div i').css 'opacity': 0.3
          apLayer.setStyle fillOpacity: 0.3
          epLayer.addTo Map
          if $('input[data-layer=apLayer]').prop('checked')
            apLayer.addTo Map
        else if Map.getZoom() <= 10 and name == 'apLayer'
          # Make sure we draw layers appropriately
          # AP on bottom, ep on top
          Map.removeLayer epLayer
          layer.addTo Map
          if $('input[data-layer=epLayer]').prop('checked')
            epLayer.addTo Map
        else
          layer.addTo Map
      else
        return
    else
      if Map.hasLayer(layer)
        Map.removeLayer layer
    return
  return

# Thanks to satomacoto for providing this Gist
# https://gist.github.com/satomacoto/3384995
buildArrows = (svg, links, nodes) ->
  
  # define marker
  svg.append("svg:defs").selectAll("marker").data([ "arrow" ]).enter().append("svg:marker").attr("id", String).attr("viewBox", "0 -5 10 10").attr("refX", 10).attr("refY", 0).attr("markerWidth", 10).attr("markerHeight", 10).attr("orient", "auto").append("svg:path").attr "d", "M0,-5L10,0L0,5"
  svg.selectAll("line").data(links).enter().append("svg:line").attr("x1", (d) ->
    nodes[d.s].x
  ).attr("y1", (d) ->
    nodes[d.s].y
  ).attr("x2", (d) ->
    nodes[d.t].x
  ).attr("y2", (d) ->
    nodes[d.t].y
  ).attr("class", "link arrow").attr "marker-end", "url(#arrow)"
  svg.append("text").attr("x", 94).attr("y", 67).text("increasing storm frequency").style "font-size", "11px"

# TODO: Consider building out better context object for legend

# TODO: Use real templates...

# loop through our extreme precip. intervals and generate a set of rectangle w/ the appropriate pattern
# then fill w/ pattern

#TODO: Make data object and loop w/ d3...

#build simple list for flood colors
# The number of lines to draw
# The length of each line
# The line thickness
# The radius of the inner circle
# Corner roundness (0..1)
# The rotation offset
# 1: clockwise, -1: counterclockwise
# #rgb or #rrggbb or array of colors
# Rounds per second
# Afterglow percentage
# Whether to render a shadow
# Whether to use hardware acceleration
# The CSS class to assign to the spinner
# The z-index (defaults to 2000000000)
# Top position relative to parent
# Left position relative to parent

# Since we are making three separate queries, this is probably going to be a great place to 
# use promises.

# Need this to know zoom state.

# Zooming in

#Draw apLayer on top of epLayer, change some styles

#Zooming Out

#Draw epLayer on top of apLayer, revert styles
initMap = ->
  window.Map = new L.map("map",
    zoomControl: false
  ).setView([ 43.05358653605547, -89.2815113067627 ], 6)
  window.base = L.tileLayer("http://{s}.tiles.mapbox.com/v3/floatmap.jkggd5ph/{z}/{x}/{y}.png",
    maxZoom: 15
    minZoom: 5
  )
  window.floods = L.tileLayer("/static/nfhl_tiles/{z}/{x}/{y}.png",
    maxZoom: 15
    minZoom: 5
  )
  buildLegend()
  addLayer base, "base", 1
  addLayer floods, "floods", 2
  getAPData "static/ap/noaa_avg_precip.geojson"
  getEPData "static/ep/noaa_ex_precip.geojson"
  Map.addControl L.control.zoom(position: "bottomleft")
  options = placement: "auto"
  $(".legend h3").tooltip options
buildLegend = ->
  legend = L.control(position: "bottomright")
  tooltipText =
    floods: "Areas with a serious risk of flooding even without climate change, based on historical record and topography. (FEMA 2014)"
    epLayer: "Increase in the average number of days with precipitation greater than 1 inch each year in 2040-2070, relative to the present. (NOAA 2014)"
    apLayer: "Increase in the average amount of precipitation each year in 2040-2070, relative to the present. (NOAA 2014)"

  legend.onAdd = (map) ->
    div = L.DomUtil.create("div", "info legend")
    apGrades = $(range(1,11,1))
    labels = []
    $(div).append "<div data-layer='apLayer'>                        <div class='legend-panel col-md-4'>                          <h3 data-toggle='tooltip' title='" + tooltipText["apLayer"] + "'>Annual Precipitation</h3>                        </div>                        <div class='legend-data col-md-8'>                          <div data-layer='apLayer' class='legend-data'><div class='apRange'></div></div>                        </div>                     </div>                     <div data-layer='epLayer'>                        <div class='legend-panel col-md-4'>                          <h3 data-toggle='tooltip' title='" + tooltipText["epLayer"] + "'>Storm Frequency</h3>                        </div>                        <div class='legend-data col-md-8'>                          <div data-layer='epLayer'>                            <div class='epRange'></div>                          </div>                        </div>                      </div>                      <div data-layer='floods'>                        <div class='legend-panel col-md-4'>                          <h3 data-toggle='tooltip' title='" + tooltipText["floods"] + "'>Flood Zones</h3>                        </div>                        <div class='legend-data col-md-8'>                          <ul class='floodRange'></ul>                        </div>                      </div>"
    apGrades.each (index) ->
      apValue = $("<div><i style=\"background:" + getColor("ap", this) + ";\"></i></div>")
      if index % 4 is 0
        textNode = "<span>+" + this + "%</span>"
        apValue.append textNode
      $(div).find(".apRange").append apValue

    $(div).find(".apRange").append "<div class='bottom-line'>increasing annual precipitation</div>"
    epGrades = [ "orange dots", "oranger dots", "orangerer dots", "orangest dots" ]
    svg = d3.select($(div).find(".epRange")[0]).append("svg").attr("width", 325).attr("height", 70)
    svg.selectAll("rect").data(epGrades).enter().append("rect").attr("width", 81).attr("height", 25).attr("x", (d, i) ->
      81 * (i)
    ).attr("y", 0).attr "class", (d) ->
      d

    svg.append("text").attr("x", 3).attr("y", 45).text("+13%").style "font-size", "11px"
    svg.append("text").attr("x", 95).attr("y", 45).text("+26%").style "font-size", "11px"
    svg.append("text").attr("x", 196).attr("y", 45).text("+39%").style "font-size", "11px"
    svg.append("text").attr("x", 297).attr("y", 45).text("+52%").style "font-size", "11px"
    nodes = [
      x: 40
      y: 50
    ,
      x: 0
      y: 55
    ,
      x: 325
      y: 55
    ,
      x: 170
      y: 60
     ]
    links = [
      s: 1
      t: 2
      u: 3
      label: "increasing annual precipitation"
     ]
    buildArrows svg, links, nodes
    floodRange = $("<li class=\"year-500\"><div></div><span>High</span></li><li class=\"year-100\"><div></div><span>Extreme</span></li>")
    $(div).find(".floodRange").append floodRange
    div

  legend.addTo Map

createSpinner = (element) ->
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

  target = document.getElementById(element)
  spinner = new Spinner(opts).spin(target)

buildPopup = (coordinates) ->
  Map.removeLayer marker
  marker = L.marker(coordinates).addTo(Map)
  createSpinner ".leaflet-popup-content"
  noaaApScore = undefined
  popup = new L.Popup(minWidth: 350)
  popup.setLatLng coordinates
  marker.bindPopup(popup).openPopup popup
  $.post("get_score/ap/",
    lng: coordinates.lng
    lat: coordinates.lat
  ).done (data) ->
    noaaApScore = data
    popupContent = "<p>This address has a high risk of of more floods due to climate change</p><ul class='metrics'></ul>"
    popup.setContent popupContent
    if noaaApScore > 0
      apData = "<li><label>Annual Precipitation:</label><span>" + noaaApScore + "% Increase</span><a href='#''>source</a></li>"
    else
      apData = "<li><label>Annual Precipitation:</label><span>No Data Yet</span><a href='#''>source</a></li>"
    epData = "<li><label>Storm Frequency:</label><span>25% Increase</span><a href='#'>source</a></li>"
    fhData = "<li><label>Flood Hazard Zone:</label> <span>Extreme</span> <a href='#'>source</a></li>"
    $(".metrics").append(apData).append(epData).append fhData
    spinner.stop()


showAddress = (address) ->
  g = new google.maps.Geocoder()
  g.geocode
    address: address
  , (results, status) ->
    latLng = [ results[0].geometry.location.lat(), results[0].geometry.location.lng() ]
    Map.setView latLng, 18


isCached = (field) ->
  return false  if Cache[field] is `undefined`
  true

buildEPLayer = ->
  window.epLayer = L.geoJson(Cache.epData,
    style: (feature, layer) ->
      className: getPattern("ep", feature.properties.DN)

    onEachFeature: (feature, layer) ->
      layer.on dblclick: (e) ->
        buildPopup e.latlng  if Map.getZoom() is 15
        Map.zoomIn()

  )
  addLayer epLayer, "epLayer", 3

buildAPLayer = ->
  window.apLayer = L.geoJson(Cache.apData,
    style: (feature) ->
      color: getColor("ap", feature.properties.DN)
      fillOpacity: 0.4

    onEachFeature: (feature, layer) ->
      layer.on dblclick: (e) ->
        buildPopup e.latlng  if Map.getZoom() is 15
        Map.zoomIn()

  )
  addLayer apLayer, "apLayer", 2

getEPData = (url) ->
  if isCached("epData") is false
    $.getJSON url, (data) ->
      Cache.epData = data
      buildEPLayer()

  else
    buildEPLayer()

getAPData = (url) ->
  if isCached("apData") is false
    $.getJSON url, (data) ->
      Cache.apData = data
      buildAPLayer()

  else
    buildAPLayer()

setEventListeners = ->
  Map.on "zoomstart", (e) ->
    window.previousZoom = Map.getZoom()

  Map.on "dblclick", (e) ->
    L.DomEvent.stopPropagation e
    buildPopup e.latlng  if Map.getZoom() is 15

  Map.on "zoomend", (e) ->
    Map.removeLayer marker  if Map.getZoom() < 15 and previousZoom > Map.getZoom()
    if Map.getZoom() is 11 and previousZoom < Map.getZoom()
      if $("input[data-layer=apLayer]").prop("checked")
        Map.removeLayer apLayer
        $(".dots").attr "class", (index, classNames) ->
          classNames + " behind"

        $(".apRange > div i").css opacity: 0.3
        apLayer.setStyle fillOpacity: 0.3
        apLayer.addTo Map
    else if Map.getZoom() is 10 and previousZoom > Map.getZoom()
      if $("input[data-layer=epLayer]").prop("checked")
        Map.removeLayer epLayer
        $(".apRange > div i").css opacity: 0.4
        apLayer.setStyle fillOpacity: 0.4
        epLayer.addTo Map
        $(".dots").attr "class", (index, classNames) ->
          classArray = classNames.split(" ")
          classArray.pop()  if $.inArray("behind", classNames) isnt -1
          origClassNames = classArray.join(" ")
          origClassNames


  $("#search").on "submit", (e) ->
    e.preventDefault()
    address = $(this).find(".search-input").val()
    showAddress address


$(document).ready ->
  window.marker = ""
  window.Cache = {}
  initMap()
  setEventListeners()
