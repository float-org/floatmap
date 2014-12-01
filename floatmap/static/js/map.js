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
    return d >= 48 ? 'biggest dots' :
           d >= 41 ? 'bigger dots'  :
           d >= 34 ? 'big dots'     :
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
          layer.addTo(Map);
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

  var tooltipText = {
    'floods': 'Locations that have a higher risk of flood due to climate change.',
    'epLayer': 'Percentage change in extreme precipitation.',
    'apLayer': 'The average amount of annual precipitation.'
  };

  legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend'),
          apGrades = $([0,1,2,3,4,5,6,7,8,9,10,11,12]),
          labels = [];

      $(div).append("<div data-layer='apLayer'>\
                        <div class='legend-panel col-md-3'>\
                          <h3 data-toggle='tooltip' title='" + tooltipText['apLayer'] +"'>Annual Precipitation</h3>\
                        </div>\
                        <div class='legend-data col-md-9'>\
                          <div data-layer='apLayer' class='legend-data'><div class='apRange'></div></div>\
                        </div>\
                     </div>\
                     <div data-layer='epLayer'>\
                        <div class='legend-panel col-md-3'>\
                          <h3 data-toggle='tooltip' title='" + tooltipText['epLayer'] +"'>Storm Frequency</h3>\
                        </div>\
                        <div class='legend-data col-md-9 '>\
                          <div data-layer='epLayer'>\
                            <div class='epRange'></div>\
                          </div>\
                        </div>\
                      </div>\
                      <div data-layer='floods'>\
                        <div class='legend-panel col-md-3'>\
                          <h3 data-toggle='tooltip' title='" + tooltipText['floods'] +"'>Flood Zones</h3>\
                        </div>\
                        <div class='legend-data col-md-9'>\
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

      // loop through our extreme precip. intervals and generate a set of rectangle w/ the appropriate pattern
      // then fill w/ pattern
      var epGrades = ['dots', 'big dots', 'bigger dots', 'biggest dots'];
      var svg = d3.select($(div).find('.epRange')[0]).append("svg").attr("width", 150).attr("height", 50);
      svg.selectAll('rect').data(epGrades)
                           .enter()    
                           .append('rect')
                           .attr('width',25)
                           .attr('height',25)
                           .attr('x', function(d,i) {
                            return 30 * (i);
                           })
                           .attr('y',0 )
                           .attr('class', function(d) { return d; })
      svg.append('text')
         .attr("x", 85)
         .attr("y", 45)
         .text('50%')
      svg.append('text')
         .attr("x", 3)
         .attr("y", 45)
         .text('0%')
                           

      
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
    var popupContent = $('#popup')[0],
        popup = new L.Popup();
    popup.onAdd = function() {
      console.log(this._latlng);

    };
    popup.setLatLng(latLng);
    popup.setContent(popupContent);
    marker.bindPopup(popup).openPopup(popup);

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
              fillOpacity: 0.6, };
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
    window.previousZoom = Map.getZoom();
  });

  Map.on('zoomend', function(e) {
    if (Map.getZoom() === 11 && previousZoom < Map.getZoom()) {
      Map.removeLayer(apLayer);
      $('.dots').attr('class', function(index, classNames) {
        return classNames + ' behind';
      });
      apLayer.addTo(Map);
    } else if (Map.getZoom() === 10 && previousZoom > Map.getZoom()) {
      Map.removeLayer(epLayer);
      epLayer.addTo(Map);
      $('.dots').attr('class', function(index, classNames) {
        var classArray = classNames.split(" ");
        classArray.pop();
        origClassNames = classArray.join(" ");
        return origClassNames;
      });
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
