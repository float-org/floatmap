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
    return d >= 42 ? 'biggest dots' :
           d >= 32 ? 'bigger dots'  :
           d >= 22 ? 'big dots'     :
           'dots';
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

  layerToggle.on('click', function(e) {
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
          apLayer.addTo(Map);
        } else if (Map.getZoom() <= 10 && name === "apLayer") {
          // Make sure we draw layers appropriately
          // AP on bottom, ep on top
          Map.removeLayer(epLayer);
          layer.addTo(Map);
          epLayer.addTo(Map);
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

// Thanks to satomacoto for providing this Gist
// https://gist.github.com/satomacoto/3384995
function buildArrows(svg, links, nodes) {
  // define marker
  svg.append("svg:defs").selectAll("marker")
      .data(["arrow"])
      .enter().append("svg:marker")
      .attr("id", String)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 10)
      .attr("refY", 0)
      .attr("markerWidth", 10)
      .attr("markerHeight", 10)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5");

  svg.selectAll("line")
      .data(links)
      .enter()
      .append("svg:line")
      .attr("x1", function(d) { return nodes[d.s].x; })
      .attr("y1", function(d) { return nodes[d.s].y; })
      .attr("x2", function(d) { return nodes[d.t].x; })
      .attr("y2", function(d) { return nodes[d.t].y; })
      .attr("class", "link arrow")
      .attr("marker-end", "url(#arrow)");

  svg.append('text')
     .attr("x", 94)
     .attr("y", 67)
     .text('increasing storm frequency')
     .style('font-size','11px')
  }

var buildLegend = function() {
  var legend = L.control({position: 'bottomright'});
  // TODO: Consider building out better context object for legend
  var tooltipText = {
    'floods': 'Areas with a serious risk of flooding even without climate change, based on historical record and topography. (FEMA 2014)',
    'epLayer': 'Increase in the average number of days with precipitation greater than 1 inch each year in 2040-2070, relative to the present. (NOAA 2014)',
    'apLayer': 'Increase in the average amount of precipitation each year in 2040-2070, relative to the present. (NOAA 2014)'
  };

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
      var epGrades = ['dots', 'big dots', 'bigger dots', 'biggest dots'];
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

var showAddress = function(address) {
	var g = new google.maps.Geocoder();
	g.geocode({ 'address': address }, function(results, status) {
		latLng = [results[0].geometry.location.lat(), results[0].geometry.location.lng()];
		Map.setView(latLng, 18);
		var marker = L.marker(latLng).addTo(Map);
    // var popupContent = $('#popup')[0],
    //     popup = new L.Popup();
    
    // popup.setLatLng(latLng);
    // popup.setContent(popupContent);
    // marker.bindPopup(popup).openPopup(popup);

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

  Map.on('zoomend', function(e) {
    // Zooming in
    if (Map.getZoom() === 11 && previousZoom < Map.getZoom()) {
      //Draw apLayer on top of epLayer, change some styles
      if ($('input[data-layer=apLayer]').is('checked')) {
          
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
      if ($('input[data-layer=epLayer]').is('checked')) {
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
  window.Map = new L.map('map', {zoomControl: false}).setView([43.05358653605547, -89.2815113067627], 7);
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
  window.Cache = {};
  initMap();
  setEventListeners();
});
