var getColor = function(type ,d) {
  if (type === 'ep') { 
    //dn represents percentage increase over time
    return d >= 40 ? '#2989d8' :
    d >= 20  ? '#64a7dc' : //lightblue
    'transparent';
  }}

/* Builds toggleable tile layer */
var addLayer = function(layer, name, zIndex, url) {
  layer.setZIndex(zIndex).addTo(Map);      

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
  $(Layers.childNodes).each(function() { 
    if (name === this.innerHTML) {
      appendIt = false;
    }
  });

  console.log(!appendIt);
  if (appendIt) {
    Layers.appendChild(link);
  }
  
}

var buildEPLegend = function() {
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

      div.innerHTML += '<button id="epToggle">Toggle EP Data</button>'

    return div;
  };

  legend.addTo(Map);}

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
    style: function(feature) {
     return { color: getColor('ep', feature.properties.dn) }
    }
  });
  window.epLayer2 = L.geoJson(Cache.epData, {
    fillPattern: {
      url: 'static/img/corrugation.png',
      pattern: {
              width: '8px',
              height: '5px',
        patternUnits: 'userSpaceOnUse',
      },
      image: {
        width: '8px',
        height: '5px',
      }
    },
    style: { 
      "opacity": 0.3,
      "fillOpacity": 0.3
    }
  });

  console.log(epLayer);
  console.log(epLayer2);

  addLayer(epLayer, 'epLayer', 2)
  addLayer(epLayer2, 'epLayer2', 3);

  if ($('.legend').length === 0) {
    buildEPLegend();
  }

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
     
var setEventListeners = function() {
  $("#epToggle").on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (Map.hasLayer(epLayer) || Map.hasLayer(epLayer2)) {
      epLayer.clearLayers()
      epLayer2.clearLayers()
      Map.removeLayer(epLayer)
      Map.removeLayer(epLayer2)
    } else {
     buildEPLayer()
    }
  })

  Map.on('zoomend', function(e) {
    if (Map.getZoom() > 8) {
      if (Map.hasLayer(epLayer)) {
        Map.removeLayer(epLayer)
      }
      if (Map.hasLayer(epLayer2)) {
        Map.removeLayer(epLayer2)
      }
    } 

    if (Map.getZoom() <= 8) {
      if (!Map.hasLayer(epLayer) && (!Map.hasLayer(epLayer2))) {
        buildEPLayer()
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
  
  addLayer(base, 'base', 1);
  addLayer(floods, 'floods', 4);
  getEPData('http://localhost:8000/static/ep/noaa_ex_precip.geojson');
  setEventListeners();
}


$(document).ready(function() {
  window.Cache = {},
  window.Layers = document.getElementById('menu-ui');
  initMap()
});
