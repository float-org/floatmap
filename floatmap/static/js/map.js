var getColor = function(type ,d) {
  if (type === 'ap') { 
    rainbow = new Rainbow();
    rainbow.setSpectrum('#FF0000','#0000FF')
    rainbow.setNumberRange(0,12);
    return '#' + rainbow.colourAt(d)
  }}

/* Builds toggleable tile layer */
var addLayer = function(layer, name, zIndex, url) {
  layer.setZIndex(zIndex).addTo(Map); 
  addLayerToggleToLegend(layer,name)       
}

var addLayerToggleToLegend = function(layer, name) {
  // Create a simple layer switcher that
  // toggles layers on and off.
  var link = document.createElement('a');
      link.href = '#';
      link.className = 'active';
      link.innerHTML = name;

  link.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();

      if (Map.hasLayer(layer)) {
          Map.removeLayer(layer);
          this.className = '';
      } else {
          Map.addLayer(layer);
          this.className = 'active';
      }
  };

  var appendIt = true;
  console.log(Layers);
  $(Layers.childNodes).each(function() { 
    if (name === this.innerHTML) {
      appendIt = false  ;
    }
  });

  if (appendIt) {
    Layers.appendChild(link);
  }
}

var buildLegend = function() {

  var legend = L.control({position: 'topleft'});

  legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend'),
          grades = [20,40],
          labels = [];

      // loop through our density intervals and generate a label with a colored square for each interval
      div.innerHTML += '<h3>EP Risk</h3>'
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor('ep', grades[i]) + '"></i> ' +
              grades[i] + '%<br>';
      }

      window.Layers = document.createElement('nav');
      Layers.id = 'menu-ui';
      Layers.className = 'menu-ui';
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
    fillPattern: {
      url: 'static/img/hixs-evolution.png',
      pattern: {
        width: '35px',
        height: '34px',
        patternUnits: 'userSpaceOnUse',
      },
      image: {
        width: '35px',
        height: '34px',
      }
    },
    style: function(feature) { 
      return {
        fillOpacity:0.5
      }
    }
  });

  addLayer(epLayer, 'epLayer', 3);

}


var buildAPLayer = function() {
  window.apLayer = L.geoJson(Cache.apData, {
    style: function(feature) {
     console.log(feature)
     return { color: getColor('ap', feature.properties.DN),
              fillOpacity: 0.4, }
    }
  });

  addLayer(apLayer, 'apLayer', 2)
}


var getEPData = function(url) {
  console.log(url);
  if (isCached('epData') === false) {
    $.getJSON(url, function(data) {
        Cache.epData = data
        buildEPLayer()
    });
  } else {
    buildEPLayer()
  }
}

var getAPData = function(url) {
  console.log(url);
  if (isCached('apData') === false) {
    $.getJSON(url, function(data) {
        Cache.apData = data
        buildAPLayer()
    });
  } else {
    buildAPLayer()
  }
}
     
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
     buildEPLayer()
     buildAPLayer()
    }
  })

  Map.on('zoomend', function(e) {
    if (Map.getZoom() > 8) {
      if (Map.hasLayer(epLayer)) {
        Map.removeLayer(epLayer)
      }
      if (Map.hasLayer(apLayer)) {
        Map.removeLayer(apLayer)
      }
    } 

    if (Map.getZoom() <= 8) {
      if (!Map.hasLayer(epLayer) && (!Map.hasLayer(apLayer))) {
        buildEPLayer()
        buildAPLayer()
      }
    } 
  }) 
 
	$("#search").on('submit', function(e) {
		e.preventDefault(e);
		address = $(this).find('.search-input').val();
		showAddress(address);
	});

	$('.fb').on('click', function(e) {
		if (Object.prototype.toString.call(FB) !== "undefined") {
			FB.ui({
			  method: 'share',
			  href: 'http://www.floatmap.com:8000',
			}, function(response){

			});
		}
	});

	$('.twitter').on('click', function(e) {
		//share window config
	    var width  = 575,
	        height = 400,
	        left   = ($(window).width()  - width)  / 2,
	        top    = ($(window).height() - height) / 2,
	        url    = 'https://twitter.com/share?url=http://www.example.com',
	        opts   = 'status=1' +
	                 ',width='  + width  +
	                 ',height=' + height +
	                 ',top='    + top    +
	                 ',left='   + left;
	    
	    window.open(url, 'twitter', opts);
 
	    return false;
	 });}


function initMap() { 
  window.Map = new L.map('map').setView([43.05358653605547, -89.2815113067627], 7);
  
  var base = L.tileLayer('http://{s}.tiles.mapbox.com/v3/floatmap.jkggd5ph/{z}/{x}/{y}.png', {maxZoom: 15, minZoom: 5}),
      floods = L.tileLayer('/static/gen_tiles/{z}/{x}/{y}.png', {maxZoom: 15, minZoom: 5});

  if ($('.legend').length === 0) {
    buildLegend()  
  }

  addLayer(base, 'base', 1);
  addLayer(floods, 'floods', 4);
  getEPData('http://localhost:8000/static/ep/noaa_ex_precip.geojson');
  getAPData('http://localhost:8000/static/ap/noaa_avg_precip.geojson');
  setEventListeners();
}


$(document).ready(function() {
  window.Cache = {},
  initMap()
});
