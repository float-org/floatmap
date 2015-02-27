(function() {
  var addLayer, addLayerToggleToLegend, buildAPLayer, buildArrows, buildEPLayer, buildLegend, buildPopup, createSpinner, getAPData, getColor, getEPData, getPattern, initMap, isCached, range, setEventListeners, showAddress;

  range = function(start, stop, step) {
    var idx, length;
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;
    length = Math.max(Math.ceil((stop - start) / step), 0);
    range = Array(length);
    idx = 0;
    while (idx < length) {
      range[idx] = start;
      idx++;
      start += step;
    }
    return range;
  };

  getColor = function(type, d) {
    var rainbow;
    if (type === 'ap') {
      rainbow = new Rainbow;
      rainbow.setSpectrum('#94FFDB', '#1900FF');
      rainbow.setNumberRange(0, 12);
      return '#' + rainbow.colourAt(d);
    }
  };

  getPattern = function(type, d) {
    if (type === 'ep') {
      if (d >= 42) {
        return 'orangest dots';
      } else if (d >= 32) {
        return 'orangerer dots';
      } else if (d >= 22) {
        return 'oranger dots';
      } else {
        return 'orange dots';
      }
    }

    /* Builds toggleable tile layer */
  };

  addLayer = function(layer, name, zIndex, url) {
    layer.setZIndex(zIndex).addTo(Map);
    if (name !== 'base') {
      addLayerToggleToLegend(layer, name);
    }
  };

  addLayerToggleToLegend = function(layer, name) {
    var layerToggle, template;
    template = $('<div class="onoffswitch"><input type="checkbox" name=' + name + '-switch" class="onoffswitch-checkbox" data-layer=' + name + ' id="' + name + '-switch" checked><label class="onoffswitch-label" for="' + name + '-switch"><span class="onoffswitch-inner"></span><span class="onoffswitch-switch"></span></label></div>');
    $('.legend div[data-layer=' + name + '] .legend-panel').append(template);
    layerToggle = $(template).find('input');
    layerToggle.on('click', function(event) {
      event.stopPropagation();
      if ($(this).is(':checked')) {
        if (!Map.hasLayer(layer)) {
          if (Map.getZoom() >= 11 && name === 'epLayer') {
            Map.removeLayer(apLayer);
            $('.dots').attr('class', function(index, classNames) {
              return classNames + ' behind';
            });
            $('.apRange > div i').css({
              'opacity': 0.3
            });
            apLayer.setStyle({
              fillOpacity: 0.3
            });
            epLayer.addTo(Map);
            if ($('input[data-layer=apLayer]').prop('checked')) {
              apLayer.addTo(Map);
            }
          } else if (Map.getZoom() <= 10 && name === 'apLayer') {
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

  buildArrows = function(svg, links, nodes) {
    svg.append("svg:defs").selectAll("marker").data(["arrow"]).enter().append("svg:marker").attr("id", String).attr("viewBox", "0 -5 10 10").attr("refX", 10).attr("refY", 0).attr("markerWidth", 10).attr("markerHeight", 10).attr("orient", "auto").append("svg:path").attr("d", "M0,-5L10,0L0,5");
    svg.selectAll("line").data(links).enter().append("svg:line").attr("x1", function(d) {
      return nodes[d.s].x;
    }).attr("y1", function(d) {
      return nodes[d.s].y;
    }).attr("x2", function(d) {
      return nodes[d.t].x;
    }).attr("y2", function(d) {
      return nodes[d.t].y;
    }).attr("class", "link arrow").attr("marker-end", "url(#arrow)");
    return svg.append("text").attr("x", 94).attr("y", 67).text("increasing storm frequency").style("font-size", "11px");
  };

  initMap = function() {
    var options;
    window.Map = new L.map("map", {
      zoomControl: false
    }).setView([43.05358653605547, -89.2815113067627], 6);
    window.base = L.tileLayer("http://{s}.tiles.mapbox.com/v3/floatmap.jkggd5ph/{z}/{x}/{y}.png", {
      maxZoom: 15,
      minZoom: 5
    });
    window.floods = L.tileLayer("/static/nfhl_tiles/{z}/{x}/{y}.png", {
      maxZoom: 15,
      minZoom: 5
    });
    buildLegend();
    addLayer(base, "base", 1);
    addLayer(floods, "floods", 2);
    getAPData("static/ap/noaa_avg_precip.geojson");
    getEPData("static/ep/noaa_ex_precip.geojson");
    Map.addControl(L.control.zoom({
      position: "bottomleft"
    }));
    options = {
      placement: "auto"
    };
    return $(".legend h3").tooltip(options);
  };

  buildLegend = function() {
    var legend, tooltipText;
    legend = L.control({
      position: "bottomright"
    });
    tooltipText = {
      floods: "Areas with a serious risk of flooding even without climate change, based on historical record and topography. (FEMA 2014)",
      epLayer: "Increase in the average number of days with precipitation greater than 1 inch each year in 2040-2070, relative to the present. (NOAA 2014)",
      apLayer: "Increase in the average amount of precipitation each year in 2040-2070, relative to the present. (NOAA 2014)"
    };
    legend.onAdd = function(map) {
      var apGrades, div, epGrades, floodRange, labels, links, nodes, svg;
      div = L.DomUtil.create("div", "info legend");
      apGrades = $(range(1, 11, 1));
      labels = [];
      $(div).append("<div data-layer='apLayer'>                        <div class='legend-panel col-md-4'>                          <h3 data-toggle='tooltip' title='" + tooltipText["apLayer"] + "'>Annual Precipitation</h3>                        </div>                        <div class='legend-data col-md-8'>                          <div data-layer='apLayer' class='legend-data'><div class='apRange'></div></div>                        </div>                     </div>                     <div data-layer='epLayer'>                        <div class='legend-panel col-md-4'>                          <h3 data-toggle='tooltip' title='" + tooltipText["epLayer"] + "'>Storm Frequency</h3>                        </div>                        <div class='legend-data col-md-8'>                          <div data-layer='epLayer'>                            <div class='epRange'></div>                          </div>                        </div>                      </div>                      <div data-layer='floods'>                        <div class='legend-panel col-md-4'>                          <h3 data-toggle='tooltip' title='" + tooltipText["floods"] + "'>Flood Zones</h3>                        </div>                        <div class='legend-data col-md-8'>                          <ul class='floodRange'></ul>                        </div>                      </div>");
      apGrades.each(function(index) {
        var apValue, textNode;
        apValue = $("<div><i style=\"background:" + getColor("ap", this) + ";\"></i></div>");
        if (index % 4 === 0) {
          textNode = "<span>+" + this + "%</span>";
          apValue.append(textNode);
        }
        return $(div).find(".apRange").append(apValue);
      });
      $(div).find(".apRange").append("<div class='bottom-line'>increasing annual precipitation</div>");
      epGrades = ["orange dots", "oranger dots", "orangerer dots", "orangest dots"];
      svg = d3.select($(div).find(".epRange")[0]).append("svg").attr("width", 325).attr("height", 70);
      svg.selectAll("rect").data(epGrades).enter().append("rect").attr("width", 81).attr("height", 25).attr("x", function(d, i) {
        return 81 * i;
      }).attr("y", 0).attr("class", function(d) {
        return d;
      });
      svg.append("text").attr("x", 3).attr("y", 45).text("+13%").style("font-size", "11px");
      svg.append("text").attr("x", 95).attr("y", 45).text("+26%").style("font-size", "11px");
      svg.append("text").attr("x", 196).attr("y", 45).text("+39%").style("font-size", "11px");
      svg.append("text").attr("x", 297).attr("y", 45).text("+52%").style("font-size", "11px");
      nodes = [
        {
          x: 40,
          y: 50
        }, {
          x: 0,
          y: 55
        }, {
          x: 325,
          y: 55
        }, {
          x: 170,
          y: 60
        }
      ];
      links = [
        {
          s: 1,
          t: 2,
          u: 3,
          label: "increasing annual precipitation"
        }
      ];
      buildArrows(svg, links, nodes);
      floodRange = $("<li class=\"year-500\"><div></div><span>High</span></li><li class=\"year-100\"><div></div><span>Extreme</span></li>");
      $(div).find(".floodRange").append(floodRange);
      return div;
    };
    return legend.addTo(Map);
  };

  createSpinner = function(element) {
    var opts, spinner, target;
    opts = {
      lines: 11,
      length: 4,
      width: 2,
      radius: 7,
      corners: 0.9,
      rotate: 0,
      direction: 1,
      color: "#000",
      speed: 1,
      trail: 60,
      shadow: false,
      hwaccel: false,
      className: "spinner",
      zIndex: 2e9,
      top: "50%",
      left: "50%"
    };
    target = document.getElementById(element);
    return spinner = new Spinner(opts).spin(target);
  };

  buildPopup = function(coordinates) {
    var noaaApScore, popup;
    if (window.marker != null) {
      Map.removeLayer(window.marker);
    }
    window.marker = L.marker(coordinates).addTo(Map);
    createSpinner(".leaflet-popup-content");
    noaaApScore = void 0;
    popup = new L.Popup({
      minWidth: 350
    });
    popup.setLatLng(coordinates);
    marker.bindPopup(popup).openPopup(popup);
    return $.post("get_score/ap/", {
      lng: coordinates.lng,
      lat: coordinates.lat
    }).done(function(data) {
      var apData, epData, fhData, popupContent;
      noaaApScore = data;
      popupContent = "<p>This address has a high risk of of more floods due to climate change</p><ul class='metrics'></ul>";
      popup.setContent(popupContent);
      if (noaaApScore > 0) {
        apData = "<li><label>Annual Precipitation:</label><span>" + noaaApScore + "% Increase</span><a href='#''>source</a></li>";
      } else {
        apData = "<li><label>Annual Precipitation:</label><span>No Data Yet</span><a href='#''>source</a></li>";
      }
      epData = "<li><label>Storm Frequency:</label><span>25% Increase</span><a href='#'>source</a></li>";
      fhData = "<li><label>Flood Hazard Zone:</label> <span>Extreme</span> <a href='#'>source</a></li>";
      $(".metrics").append(apData).append(epData).append(fhData);
      return spinner.stop();
    });
  };

  showAddress = function(address) {
    var g;
    g = new google.maps.Geocoder();
    return g.geocode({
      address: address
    }, function(results, status) {
      var latLng;
      latLng = [results[0].geometry.location.lat(), results[0].geometry.location.lng()];
      return Map.setView(latLng, 18);
    });
  };

  isCached = function(field) {
    if (Cache[field] === undefined) {
      return false;
    }
    return true;
  };

  buildEPLayer = function() {
    window.epLayer = L.geoJson(Cache.epData, {
      style: function(feature, layer) {
        return {
          className: getPattern("ep", feature.properties.DN)
        };
      },
      onEachFeature: function(feature, layer) {
        return layer.on({
          dblclick: function(e) {
            if (Map.getZoom() === 15) {
              buildPopup(e.latlng);
            }
            return Map.zoomIn();
          }
        });
      }
    });
    return addLayer(epLayer, "epLayer", 3);
  };

  buildAPLayer = function() {
    window.apLayer = L.geoJson(Cache.apData, {
      style: function(feature) {
        return {
          color: getColor("ap", feature.properties.DN),
          fillOpacity: 0.4
        };
      },
      onEachFeature: function(feature, layer) {
        return layer.on({
          dblclick: function(e) {
            if (Map.getZoom() === 15) {
              buildPopup(e.latlng);
            }
            return Map.zoomIn();
          }
        });
      }
    });
    return addLayer(apLayer, "apLayer", 2);
  };

  getEPData = function(url) {
    if (isCached("epData") === false) {
      return $.getJSON(url, function(data) {
        Cache.epData = data;
        return buildEPLayer();
      });
    } else {
      return buildEPLayer();
    }
  };

  getAPData = function(url) {
    if (isCached("apData") === false) {
      return $.getJSON(url, function(data) {
        Cache.apData = data;
        return buildAPLayer();
      });
    } else {
      return buildAPLayer();
    }
  };

  setEventListeners = function() {
    Map.on("zoomstart", function(e) {
      return window.previousZoom = Map.getZoom();
    });
    Map.on("dblclick", function(e) {
      L.DomEvent.stopPropagation(e);
      if (Map.getZoom() === 15) {
        return buildPopup(e.latlng);
      }
    });
    Map.on("zoomend", function(e) {
      if (Map.getZoom() < 15 && previousZoom > Map.getZoom()) {
        Map.removeLayer(marker);
      }
      if (Map.getZoom() === 11 && previousZoom < Map.getZoom()) {
        if ($("input[data-layer=apLayer]").prop("checked")) {
          Map.removeLayer(apLayer);
          $(".dots").attr("class", function(index, classNames) {
            return classNames + " behind";
          });
          $(".apRange > div i").css({
            opacity: 0.3
          });
          apLayer.setStyle({
            fillOpacity: 0.3
          });
          return apLayer.addTo(Map);
        }
      } else if (Map.getZoom() === 10 && previousZoom > Map.getZoom()) {
        if ($("input[data-layer=epLayer]").prop("checked")) {
          Map.removeLayer(epLayer);
          $(".apRange > div i").css({
            opacity: 0.4
          });
          apLayer.setStyle({
            fillOpacity: 0.4
          });
          epLayer.addTo(Map);
          return $(".dots").attr("class", function(index, classNames) {
            var classArray, origClassNames;
            classArray = classNames.split(" ");
            if ($.inArray("behind", classNames) !== -1) {
              classArray.pop();
            }
            origClassNames = classArray.join(" ");
            return origClassNames;
          });
        }
      }
    });
    return $("#search").on("submit", function(e) {
      var address;
      e.preventDefault();
      address = $(this).find(".search-input").val();
      return showAddress(address);
    });
  };

  $(document).ready(function() {
    window.marker;
    window.Cache = {};
    initMap();
    return setEventListeners();
  });

}).call(this);

//# sourceMappingURL=main.js.map
