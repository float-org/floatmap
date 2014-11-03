function getColor(type ,d) {
    if (type === 'ep') { 
      //dn represents percentage increase over time
      return d >= 40 ? 'blue' :
      d >= 20  ? 'teal' : //lightblue
      'transparent';
    }
}

function buildEPLegend() {
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

  legend.addTo(Map);
}

//TODO: Update height to use vh so we can remove this
function updateMapContainer() {
	var width = $(window).width(),
		height = $(window).height(),
    headerHeight = $('header').height();

	$("#map-container").width(width)
					   .height(height - headerHeight);

	Map.invalidateSize();			
}

function showAddress(address) {
	var g = new google.maps.Geocoder();	
	g.geocode({ 'address': address }, function(results, status) {
		latLng = [results[0].geometry.location.lat(), results[0].geometry.location.lng()];
		Map.setView(latLng, 18)
		L.marker(latLng).addTo(Map);
		$('#share').removeClass('hidden');
	})
}

function getExtremePrecipitationJson(url) {
  if (Data.extremePrecipitation === undefined) {
    $.getJSON(url, function(data) {
        Data.extremePrecipitation = data
        epLayer = L.geoJson(Data.extremePrecipitation, {
          style: function(feature) { 
            return { color: getColor('ep', feature.properties.dn) }
          }
      });
      epLayer.addTo(Map);
    });
  } else {
    epLayer = L.geoJson(Data.extremePrecipitation, {
          style: function(feature) { 
            return { color: getColor('ep', feature.properties.dn) }
          }
      });
    epLayer.addTo(Map);
  }
}

function setEventListeners() {
	$(window).on('resize', function() {
		updateMapContainer();
	});

  $("#epToggle").on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (Map.hasLayer(epLayer)) {
      epLayer.clearLayers()
      Map.removeLayer(epLayer)
    } else {
     getExtremePrecipitationJson('http://localhost:8000/static/ep/noaa_ex_precip.geojson')
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
	 });
}

var addLayer = function(layer, name, zIndex, url) {
      layer
          .setZIndex(zIndex)
          .addTo(Map);      

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

    Layers.appendChild(link);
}

