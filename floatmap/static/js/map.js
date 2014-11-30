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
    return d >= 48 ? 'biggest-dots' :
           d >= 41 ? 'bigger-dots'  :
           d >= 34 ? 'big-dots'     :
           'dots';
  }
};

/* Builds toggleable tile layer */
var addLayer = function(layer, name, zIndex, url) {
  layer.setZIndex(zIndex).addTo(Map);
  if (name !== "base")
  addLayerToggleToLegend(layer,name);
};

var addLayerToggleToLegend = function(layer, name) {
  // Create a simple layer switcher that
  // toggles layers on and off.
  template = $('<div class="onoffswitch"><input type="checkbox" name='+ name +'-switch" class="onoffswitch-checkbox" data-layer='+ name +' id="' + name + '-switch" checked><label class="onoffswitch-label" for="' + name + '-switch"><span class="onoffswitch-inner"></span><span class="onoffswitch-switch"></span></label></div>')
  var appendIt = true;

  $(Layers.childNodes).each(function() {
    if (name === this.innerHTML) {
      appendIt = false;
    }
  });

  if (appendIt) {
    $(Layers).append(template);
  }
  
  var layerToggle = $(template).find('input')

  layerToggle.on('click', function(e) {
      if ($(this).is(':checked')) {
        if (!Map.hasLayer(layer)) {
          console.log('add the layer');
          Map.addLayer(layer);
        }
      } else {
        if (Map.hasLayer(layer)) {
          console.log('remove the layer');
          Map.removeLayer(layer);
        }
      }  
  });
};

var buildLegend = function() {
  var legend = L.control({position: 'topleft'});

  var tooltipText = {
    'floods': 'Locations that have a higher risk of flood due to climate change.',
    'ep': 'Bad storms.',
    'ap': 'The average amount of annual precipitation.'
  }

  legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend'),
          apGrades = $([0,1,2,3,4,5,6,7,8,9,10,11,12]),
          labels = [];

      // loop through our average precip. intervals and generate a label with a colored square for each interval
      div.innerHTML += '<h3 class="tt" data-toggle="tooltip" title="'+ tooltipText['ap'] +'">AP Risk</h3>';
      $(div).append("<div class='apRange'></div>");

      apGrades.each(function() {
          var apValue = '<i style="background:' + getColor('ap', this) + ';"></i>';
          $(div).find('.apRange').append(apValue);
      });

      // loop through our extreme precip. intervals and generate a set of rectangle w/ the appropriate pattern
      // then fill w/ pattern
      var epGrades = ['dots', 'big-dots', 'bigger-dots', 'biggest-dots'];
      var svg = d3.select(div).append("svg").attr("width", 100).attr("height", 25);
      svg.selectAll('rect').data(epGrades)
                           .enter()
                           .append('rect')
                           .attr('width',25)
                           .attr('height',25)
                           .attr('x', function(d,i) {
                            return 25 * i;
                           })
                           .attr('y',0 )
                           .attr('class', function(d) { return d });

      div.innerHTML += '<h3 class="tt" data-toggle="tooltip" title="'+ tooltipText['ep'] +'">Storms</h3>';

      div.innerHTML += '<h3 class="tt" data-toggle="tooltip" title="'+ tooltipText['floods'] +'">Extreme Floods</h3>';
      


      
      window.Layers = document.createElement('nav');
      Layers.id = 'menu-ui';
      Layers.className = '<menu-></menu->ui';
      div.appendChild(Layers)

    return div;
  };

  legend.addTo(Map);
}

var showAddress = function(address) {
	var g = new google.maps.Geocoder();	
	g.geocode({ 'address': address }, function(results, status) {
		latLng = [results[0].geometry.location.lat(), results[0].geometry.location.lng()];
		Map.setView(latLng, 18)
		L.marker(latLng).addTo(Map);
		$('#share').removeClass('hidden');
	})}

var isCached = function(field) {
  if (Cache[field] === undefined) {
    return false;
  }
  return true;
}

var buildEPLayer = function() {
  window.epLayer = L.geoJson(Cache.epData, {
    style: function(feature, layer) {
      return { 
        className: getPattern('ep',feature.properties.DN)
      }
    }
  });
  addLayer(epLayer, 'epLayer', 3);
};


var buildAPLayer = function() {
  window.apLayer = L.geoJson(Cache.apData, {
    style: function(feature) {
     return { color: getColor('ap', feature.properties.DN),
              fillOpacity: 0.6, }
    }
  });
  addLayer(apLayer, 'apLayer', 2)
}

var getEPData = function(url) {
  if (isCached('epData') === false) {
    $.getJSON(url, function(data) {
        Cache.epData = data;
        buildEPLayer();
    });
  } else {
    buildEPLayer();
  }
}

var getAPData = function(url) {
  if (isCached('apData') === false) {
    $.getJSON(url, function(data) {
        Cache.apData = data;
        buildAPLayer();
    });
  } else {
    buildAPLayer();
  };
};
     
var setEventListeners = function() {
  $("#epToggle").on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (Map.hasLayer(epLayer) || Map.hasLayer(apLayer)) {
      epLayer.clearLayers();
      apLayer.clearLayers();
      Map.removeLayer(epLayer);
      Map.removeLayer(apLayer);
    } else {
     buildEPLayer();
     buildAPLayer();
    }
  });

  Map.on('zoomend', function(e) {
    
      if (!Map.hasLayer(epLayer) && (!Map.hasLayer(apLayer))) {
        buildEPLayer();
        buildAPLayer();
      }
  });
 
	$("#search").on('submit', function(e) {
		e.preventDefault(e);
		address = $(this).find('.search-input').val();
		showAddress(address);
	});
};

function initMap() { 
  window.Map = new L.map('map').setView([43.05358653605547, -89.2815113067627], 7);
  
  var base = L.tileLayer('http://{s}.tiles.mapbox.com/v3/floatmap.jkggd5ph/{z}/{x}/{y}.png', {maxZoom: 15, minZoom: 5}),
      floods = L.tileLayer('/static/nfhl_tiles/{z}/{x}/{y}.png', {maxZoom: 15, minZoom: 5});

  
  buildLegend()  

  addLayer(base, 'base', 1);
  addLayer(floods, 'floods', 4);
  getEPData('{{STATIC_URL|escapejs}}ep/noaa_ex_precip.geojson');
  getAPData('{{STATIC_URL|escapejs}}ap/noaa_avg_precip.geojson');
  setEventListeners();
  options = {
    'placement': 'auto',
  }
  $('.tt').tooltip(options)

}


$(document).ready(function() {
  window.Cache = {},
  initMap()
});
