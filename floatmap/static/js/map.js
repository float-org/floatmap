var getColor = function(type, d) {
  if (type === 'ap') {
    rainbow = new Rainbow();
    rainbow.setSpectrum('#94FFDB','#1900FF');
    rainbow.setNumberRange(0,12);
    return '#' + rainbow.colourAt(d);
  }
};

var getPattern = function(type ,d) {
  if (type === 'ep') {
    return d >= 42 ? 'orangest dots' :
           d >= 32 ? 'orangerer dots'  :
           d >= 22 ? 'oranger dots'     :
           'orange dots';
  }
};

/* Builds toggleable tile layer */
var addLayer = function(layer, name, zIndex, url) {
  layer.setZIndex(zIndex).addTo(Map);
  if (name !== "base") {
    addLayerToggleToLegend(layer,name);
  }
};

var addLayerToggleToLegend = function(layer, name) {
  // Create a simple layer switcher that
  // toggles layers on and off.
  var template = $('<div class="onoffswitch"><input type="checkbox" name='+ name +'-switch" class="onoffswitch-checkbox" data-layer='+ name +' id="' + name + '-switch" checked><label class="onoffswitch-label" for="' + name + '-switch"><span class="onoffswitch-inner"></span><span class="onoffswitch-switch"></span></label></div>');

  $('.legend div[data-layer='+name+'] .legend-panel').append(template);
  
  
  var layerToggle = $(template).find('input');

  layerToggle.on('click', function(event) {

    event.stopPropagation();


    if ($(this).is(':checked')) {
      if (!Map.hasLayer(layer)) {
        // If we're zoomed in to higher levels, make sure we 
        // build the layers the appropriate way.  Only matters
        // when redrawing epLayer since it's supposed to be
        // on bottom. 
        if (Map.getZoom() >= 11 && name === "epLayer") {
          Map.removeLayer(apLayer);
          $('.dots').attr('class', function(index, classNames) {
            return classNames + ' behind';
          });
          $('.apRange > div i').css({'opacity': 0.3});
          apLayer.setStyle({
            fillOpacity:0.3
          });
          epLayer.addTo(Map);
          if ($('input[data-layer=apLayer]').prop('checked')) {
            apLayer.addTo(Map);
          }
        } else if (Map.getZoom() <= 10 && name === "apLayer") {
          // Make sure we draw layers appropriately
          // AP on bottom, ep on top
          Map.removeLayer(epLayer);
          layer.addTo(Map);
          if ($('input[data-layer=epLayer]').prop('checked')) {
            epLayer.addTo(Map);
          }
        } else {
          layer.addTo(Map);
        }
      } else {
        return;
      }
    } else {
      if (Map.hasLayer(layer)) {
        Map.removeLayer(layer);
      }
    }
  });
};


var buildLegend = function() {
  
  var legend = L.control({position: 'bottomright'});
  // TODO: Consider building out better context object for legend
  
  legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend'),
          apGrades = $([0,1,2,3,4,5,6,7,8,9,10,11,12]),
          labels = [];

      // TODO: Use real templates...
      $(div).append("<div data-layer='apLayer'>\
                        <div class='legend-panel col-md-4'>\
                          <h3 data-toggle='tooltip' title='" + tooltipText['apLayer'] +"'>Annual Precipitation</h3>\
                        </div>\
                        <div class='legend-data col-md-8'>\
                          <div data-layer='apLayer' class='legend-data'><div class='apRange'></div></div>\
                        </div>\
                     </div>\
                     <div data-layer='epLayer'>\
                        <div class='legend-panel col-md-4'>\
                          <h3 data-toggle='tooltip' title='" + tooltipText['epLayer'] +"'>Storm Frequency</h3>\
                        </div>\
                        <div class='legend-data col-md-8'>\
                          <div data-layer='epLayer'>\
                            <div class='epRange'></div>\
                          </div>\
                        </div>\
                      </div>\
                      <div data-layer='floods'>\
                        <div class='legend-panel col-md-4'>\
                          <h3 data-toggle='tooltip' title='" + tooltipText['floods'] +"'>Flood Zones</h3>\
                        </div>\
                        <div class='legend-data col-md-8'>\
                          <ul class='floodRange'></ul>\
                        </div>\
                      </div>");
      

      apGrades.each(function(index) {
          var apValue = $('<div><i style="background:' + getColor('ap', this) + ';"></i></div>');
          if (index % 4 === 0) {
            var textNode = '<span>+'+this+'%</span>';
            apValue.append(textNode);
          }
          $(div).find('.apRange').append(apValue);
      });

      $(div).find('.apRange').append("<div class='bottom-line'>increasing annual precipitation</div>")

      // loop through our extreme precip. intervals and generate a set of rectangle w/ the appropriate pattern
      // then fill w/ pattern
      var epGrades = ['orange dots', 'oranger dots', 'orangerer dots', 'orangest dots'];
      var svg = d3.select($(div).find('.epRange')[0]).append("svg").attr("width", 325).attr("height", 70);

      svg.selectAll('rect').data(epGrades)
                           .enter()    
                           .append('rect')
                           .attr('width',81)
                           .attr('height',25)
                           .attr('x', function(d,i) {
                            return 81 * (i);
                           })
                           .attr('y',0 )
                           .attr('class', function(d) { return d; })

      //TODO: Make data object and loop w/ d3...
      svg.append('text')
               .attr("x", 3)
               .attr("y", 45)
               .text('+13%')
               .style('font-size','11px')


      svg.append('text')
               .attr("x", 95)
               .attr("y", 45)
               .text('+26%')
               .style('font-size','11px')

      svg.append('text')
               .attr("x", 196)
               .attr("y", 45)
               .text('+39%')
               .style('font-size','11px')

       svg.append('text')
             .attr("x", 297)
             .attr("y", 45)
             .text('+52%')
             .style('font-size','11px')
      
      var nodes = [{x:40,y:50}, {x:0,y:55}, {x:325,y:55}, {x:170, y:60}];
      var links = [{s:1,t:2,u:3,label:"increasing annual precipitation"}];

      buildArrows(svg, links, nodes)             

      //build simple list for flood colors
      floodRange = $('<li class="year-500"><div></div><span>High</span></li><li class="year-100"><div></div><span>Extreme</span></li>');

      $(div).find('.floodRange').append(floodRange);
      
      return div;

  };

  legend.addTo(Map);
};

var createSpinner = function(element) {
  var opts = {
  lines: 11, // The number of lines to draw
  length: 4, // The length of each line
  width: 2, // The line thickness
  radius: 7, // The radius of the inner circle
  corners: 0.9, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#000', // #rgb or #rrggbb or array of colors
  speed: 1, // Rounds per second
  trail: 60, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: '50%', // Top position relative to parent
  left: '50%' // Left position relative to parent
  };
  var target = document.getElementById(element);
  var spinner = new Spinner(opts).spin(target);
}

var buildPopup = function(coordinates) {
    Map.removeLayer(marker);
    marker = L.marker(coordinates).addTo(Map);
    createSpinner('.leaflet-popup-content');
    var noaaApScore;

    // Since we are making three separate queries, this is probably going to be a great place to 
    // use promises.

    popup = new L.Popup({
              minWidth: 350,
            });
    popup.setLatLng(coordinates);
    marker.bindPopup(popup).openPopup(popup);

    $.post( "get_score/ap/", { lng: coordinates.lng, lat: coordinates.lat }).done(function( data ) {
      noaaApScore = data;
      var popupContent = "<p>This address has a high risk of of more floods due to climate change</p><ul class='metrics'></ul>";
      popup.setContent(popupContent);  
      if (noaaApScore > 0) {
       var apData = "<li><label>Annual Precipitation:</label><span>" + noaaApScore + "% Increase</span><a href='#''>source</a></li>";
      } else {
        var apData = "<li><label>Annual Precipitation:</label><span>No Data Yet</span><a href='#''>source</a></li>";  
      }
      
      var epData = "<li><label>Storm Frequency:</label><span>25% Increase</span><a href='#'>source</a></li>";
      var fhData = "<li><label>Flood Hazard Zone:</label> <span>Extreme</span> <a href='#'>source</a></li>";                          
                      
      $('.metrics').append(apData)
                   .append(epData)
                   .append(fhData);
      
        spinner.stop();
      
    });
}

var showAddress = function(address) {
  var g = new google.maps.Geocoder();
  g.geocode({ 'address': address }, function(results, status) {
    latLng = [results[0].geometry.location.lat(), results[0].geometry.location.lng()];
    Map.setView(latLng, 18);

  });
};

var isCached = function(field) {
  if (Cache[field] === undefined) {
    return false;
  }
  return true;
};

var buildEPLayer = function() {
  window.epLayer = L.geoJson(Cache.epData, {
    style: function(feature, layer) {
      return {
        className: getPattern('ep',feature.properties.DN)
      };
    },
    onEachFeature: function(feature,layer) {
      layer.on({
        dblclick: function(e) {
          if (Map.getZoom() === 15) {
            buildPopup(e.latlng);
          }
          Map.zoomIn();
        }
      });
    }
  });
  addLayer(epLayer, 'epLayer', 3);
};


var buildAPLayer = function() {
  window.apLayer = L.geoJson(Cache.apData, {
    style: function(feature) {
     return { color: getColor('ap', feature.properties.DN),
              fillOpacity: 0.4, };
    },
    onEachFeature: function(feature,layer) {
      layer.on({        
        dblclick: function(e) {
          if (Map.getZoom() === 15) {
            buildPopup(e.latlng);
          }
          Map.zoomIn();
        }
      });
    }
  });
  addLayer(apLayer, 'apLayer', 2);
};

var getEPData = function(url) {
  if (isCached('epData') === false) {
    $.getJSON(url, function(data) {
        Cache.epData = data;
        buildEPLayer();
    });
  } else {
    buildEPLayer();
  }
};

var getAPData = function(url) {
  if (isCached('apData') === false) {
    $.getJSON(url, function(data) {
        Cache.apData = data;
        buildAPLayer();
    });
  } else {
    buildAPLayer();
  }
};
     
var setEventListeners = function() {

  Map.on('zoomstart', function(e) {
    // Need this to know zoom state.
    window.previousZoom = Map.getZoom();
  });

  Map.on('dblclick', function(e) {
    L.DomEvent.stopPropagation(e);
    if (Map.getZoom() === 15) {
      buildPopup(e.latlng);
    }
  });
  


  Map.on('zoomend', function(e) {
    if (Map.getZoom() < 15 && previousZoom > Map.getZoom()) {
      Map.removeLayer(marker);
    }
    // Zooming in
    if (Map.getZoom() === 11 && previousZoom < Map.getZoom()) {
      //Draw apLayer on top of epLayer, change some styles
      if ($('input[data-layer=apLayer]').prop('checked')) {
          
        Map.removeLayer(apLayer);

        $('.dots').attr('class', function(index, classNames) {
          return classNames + ' behind';
        });

        $('.apRange > div i').css({'opacity': 0.3});

        apLayer.setStyle({
          fillOpacity:0.3
        });
  
        apLayer.addTo(Map);
      }
    //Zooming Out
    } else if (Map.getZoom() === 10 && previousZoom > Map.getZoom()) {
      //Draw epLayer on top of apLayer, revert styles
      if ($('input[data-layer=epLayer]').prop('checked')) {
        Map.removeLayer(epLayer);
        $('.apRange > div i').css({'opacity': 0.4});
        apLayer.setStyle({
          fillOpacity:0.4
        });
        epLayer.addTo(Map);
        $('.dots').attr('class', function(index, classNames) {
          var classArray = classNames.split(" ");
          if ($.inArray('behind', classNames) !== -1) {
            classArray.pop();
          }
          origClassNames = classArray.join(" ");
          return origClassNames;
        });
      }
    }
  });


 
  $("#search").on('submit', function(e) {
    e.preventDefault();
    address = $(this).find('.search-input').val();
    showAddress(address);
  });
};

function initMap() {
  window.Map = new L.map('map', {zoomControl: false}).setView([43.05358653605547, -89.2815113067627], 6);
  window.base = L.tileLayer('http://{s}.tiles.mapbox.com/v3/floatmap.jkggd5ph/{z}/{x}/{y}.png', {maxZoom: 15, minZoom: 5});
  window.floods = L.tileLayer('/static/nfhl_tiles/{z}/{x}/{y}.png', {maxZoom: 15, minZoom: 5});
  
  buildLegend();

  addLayer(base, 'base', 1);
  addLayer(floods, 'floods', 2);
  getAPData('{{STATIC_URL|escapejs}}ap/noaa_avg_precip.geojson');
  getEPData('{{STATIC_URL|escapejs}}ep/noaa_ex_precip.geojson');
  Map.addControl(L.control.zoom({ position: 'bottomleft' }));
  options = {
    'placement': 'auto',
  };
  $('.legend h3').tooltip(options);

}


$(document).ready(function() {
  window.marker = '';
  window.Cache = {};
  initMap();
  setEventListeners();
});
