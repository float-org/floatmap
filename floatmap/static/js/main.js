
/*

 TO DO

  - Move GeoModel code to separate file
  - Incorporate GeoModel w/ EP + AP data
  - Separate out code into better named methods
  - Fix tooltips not rendering
  - Test popup w/ Elasticsearch
 */

(function() {
  var GeoCollection, GeoModel, Mediator;

  GeoModel = L.GeoModel = Backbone.Model.extend({
    keepId: false,
    set: function(key, val, options) {
      var _attrs, args, attrs, geometry;
      args = void 0;
      attrs = void 0;
      _attrs = void 0;
      geometry = void 0;
      args = arguments;
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      }
      if (attrs && attrs['type'] && attrs['type'] === 'Feature') {
        _attrs = _.clone(attrs['properties']) || {};
        geometry = _.clone(attrs['geometry']) || null;
        if (geometry) {
          geometry.coordinates = geometry['coordinates'].slice();
        }
        _attrs['geometry'] = geometry;
        if (attrs[this.idAttribute]) {
          _attrs[this.idAttribute] = attrs[this.idAttribute];
        }
        args = [_attrs, options];
      }
      return Backbone.Model.prototype.set.apply(this, args);
    },
    toJSON: function(options) {
      var attrs, geometry, json, props;
      attrs = void 0;
      props = void 0;
      geometry = void 0;
      options = options || {};
      attrs = _.clone(this.attributes);
      props = _.omit(attrs, 'geometry');
      if (options.cid) {
        props.cid = this.cid;
      }
      geometry = _.clone(attrs['geometry']) || null;
      if (geometry) {
        geometry.coordinates = geometry['coordinates'].slice();
      }
      json = {
        type: 'Feature',
        geometry: geometry,
        properties: props
      };
      if (this.keepId) {
        json[this.idAttribute] = this.id;
      }
      return json;
    }
  });

  GeoCollection = L.GeoCollection = Backbone.Collection.extend({
    model: GeoModel,
    reset: function(models, options) {
      if (models && !_.isArray(models) && models.features) {
        models = models.features;
      }
      return Backbone.Collection.prototype.reset.apply(this, [models, options]);
    },
    toJSON: function(options) {
      var features;
      features = Backbone.Collection.prototype.toJSON.apply(this, arguments);
      return {
        type: 'FeatureCollection',
        features: features
      };
    }
  });

  Mediator = function() {
    var publish, subscribe;
    subscribe = function(channel, fn) {
      if (!this.channels[channel]) {
        this.channels[channel] = [];
        this.channels[channel].push({
          context: this,
          callback: fn
        });
        return this;
      }
    };
    publish = function(channel) {
      var args, i, l, subscription;
      if (!this.channels[channel]) {
        return false;
      }
      args = Array.prototype.slice.call(arguments, 1);
      i = 0;
      l = this.channels[channel].length;
      while (i < l) {
        subscription = this.channels[channel][i];
        subscription.callback.apply(subscription.context, args);
        i++;
      }
      return this;
    };
    return {
      channels: {},
      publish: publish,
      subscribe: subscribe,
      installTo: function(obj) {
        obj.subscribe = subscribe;
        return obj.publish = publish;
      }
    };
  };

  $(function() {
    var FloatLayout, HeaderView, LegendView, MapView, PopupView, app, layers, layout, mediator;
    app = window.app = window.app || {};
    layers = app.layers = [];
    mediator = app.mediator = new Mediator();
    app.getPattern = function(type, d) {
      if (type === 'ep') {
        if (d >= 42) {
          return 'huge dots';
        } else if (d >= 32) {
          return 'big dots';
        } else if (d >= 22) {
          return 'small dots';
        } else {
          return 'tiny dots';
        }
      }
    };
    app.getColor = function(type, d) {
      var rainbow;
      if (type === 'ap') {
        rainbow = new Rainbow;
        rainbow.setSpectrum('#94FFDB', '#1900FF');
        rainbow.setNumberRange(0, 12);
        return '#' + rainbow.colourAt(d);
      }
    };
    app.createSpinner = function(element) {
      var opts;
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
      window.target = document.getElementById(element);
      return window.spinner = new Spinner(opts).spin(target);
    };
    Backbone.Layout.configure({
      manage: true
    });
    app.AvgPrecipCollection = GeoCollection.extend({
      url: 'static/ap/noaa_avg_precip.geojson'
    });
    app.ExtPrecipCollection = GeoCollection.extend({
      url: 'static/ep/noaa_ex_precip.geojson'
    });
    HeaderView = app.HeaderView = Backbone.View.extend({
      template: "#headerTemplate",
      getAddress: function(address) {
        var g;
        g = new google.maps.Geocoder();
        return g.geocode({
          address: address
        }, function(results, status) {
          var latLng;
          latLng = [results[0].geometry.location.lat(), results[0].geometry.location.lng()];
          return mediator.publish('searched', latLng);
        });
      },
      events: {
        "submit #search": function(e) {
          var address;
          e.preventDefault();
          address = $(e.target).find('.search-input').val();
          return this.getAddress(address);
        }
      }
    });
    MapView = app.MapView = Backbone.View.extend({
      template: "#mapTemplate",
      el: false,
      renderPopup: function(coordinates) {
        this.popup = new PopupView({
          coordinates: coordinates
        });
        return this.popup.render();
      },
      setEvents: function() {
        app.map.on('zoomstart', function(e) {
          return this.previousZoom = app.map.getZoom();
        });
        return app.map.on('zoomend', function(e) {
          var apLayer, epLayer, map;
          map = app.map;
          if (map.getZoom() < this.previousZoom && this.previousZoom === 15) {
            map.removeLayer(window.marker);
          }
          apLayer = app.layers['apLayer'];
          epLayer = app.layers['epLayer'];
          if (map.getZoom() === 11 && this.previousZoom < map.getZoom()) {
            if ($("input[data-layer=apLayer]").prop("checked")) {
              map.removeLayer(apLayer);
              return map.addLayer(apLayer, 4);
            }
          } else if (map.getZoom() === 10 && this.previousZoom > map.getZoom()) {
            if ($("input[data-layer=epLayer]").prop("checked")) {
              map.removeLayer(epLayer);
              return map.addLayer(epLayer, 4);
            }
          }
        });
      },
      addLayer: function(layer, zIndex, url) {
        return layer.setZIndex(zIndex).addTo(app.map);
      },
      showAddress: function(latlng) {
        app.map.setView(latlng, 18);
        return app.layout.views['map'].renderPopup(latlng);
      },
      makeGeoJSONLayer: function(data, type, zIndex) {
        var self;
        self = this;
        if (type === 'ap') {
          app.layers['apLayer'] = L.geoJson(data, {
            style: function(feature, layer) {
              return {
                color: app.getColor("ap", feature.properties.DN)
              };
            },
            onEachFeature: function(feature, layer) {
              return layer.on({
                dblclick: function(e) {
                  if (app.map.getZoom() === 15) {
                    self.renderPopup(e.latlng);
                  }
                  return app.map.zoomIn();
                }
              });
            }
          });
        } else if (type === 'ep') {
          app.layers['epLayer'] = L.geoJson(data, {
            style: function(feature, layer) {
              return {
                className: app.getPattern("ep", feature.properties.DN)
              };
            },
            onEachFeature: function(feature, layer) {
              return layer.on({
                dblclick: function(e) {
                  if (app.map.getZoom() === 15) {
                    self.renderPopup(e.latlng);
                  }
                  return app.map.zoomIn();
                }
              });
            }
          });
        }
        return this.addLayer(app.layers[type + 'Layer'], zIndex);
      },
      initialize: function() {
        var self;
        self = this;
        return mediator.subscribe('searched', self.showAddress);
      },
      renderTemplate: function() {
        var base, baseURL, floods, map;
        baseURL = 'http://{s}.tiles.mapbox.com/v3/floatmap.jkggd5ph/{z}/{x}/{y}.png';
        if (!app.map) {
          map = app.map = new L.Map('map', {
            zoomControl: false
          }).setView([43.05358653605547, -89.2815113067627], 6);
        }
        base = app.layers['base'] = L.tileLayer(baseURL, {
          maxZoom: 15,
          minZoom: 5
        });
        floods = app.layers['floods'] = L.tileLayer('/static/nfhl_tiles/{z}/{x}/{y}.png', {
          maxZoom: 15,
          minZoom: 5
        });
        this.addLayer(base, 1);
        this.addLayer(floods, 2);
        this.makeGeoJSONLayer(window.apData, 'ap', 3);
        this.makeGeoJSONLayer(window.epData, 'ep', 4);
        map.addControl(L.control.zoom({
          position: "bottomleft"
        }));
        return this.setEvents();
      }
    });
    PopupView = app.PopupView = Backbone.View.extend({
      initialize: function() {
        var coordinates, map, popup;
        map = app.map;
        coordinates = this.coordinates = this.options.coordinates;
        if (window.marker != null) {
          map.removeLayer(window.marker);
        }
        window.marker = L.marker(coordinates).addTo(map);
        popup = this.popup = new L.Popup({
          minWidth: 350
        });
        popup.setLatLng(coordinates);
        window.marker.bindPopup(popup).openPopup(popup);
        return this.serialize();
      },
      serialize: function() {
        var lat, lng, self;
        self = this;
        lng = this.coordinates[0];
        lat = this.coordinates[1];
        app.createSpinner(".leaflet-popup-content");
        return $.post("get_score/ap/", {
          lng: lat,
          lat: lng
        }).done(function(data) {
          var noaaApScore;
          noaaApScore = data;
          return self.renderTemplate(noaaApScore);
        });
      },
      renderTemplate: function(score) {
        var apData, epData, fhData, popupContent;
        popupContent = "<p>This address has a high risk of of more floods due to climate change</p><ul class='metrics'></ul>";
        this.popup.setContent(popupContent);
        if (score > 0) {
          apData = "<li><label>Annual Precipitation:</label><span>" + score + "% Increase</span><a href='#''>source</a></li>";
        } else {
          apData = "<li><label>Annual Precipitation:</label><span>No Data Yet</span><a href='#''>source</a></li>";
        }
        epData = "<li><label>Storm Frequency:</label><span>25% Increase</span><a href='#'>source</a></li>";
        fhData = "<li><label>Flood Hazard Zone:</label> <span>Extreme</span> <a href='#'>source</a></li>";
        $(".metrics").append(apData).append(epData).append(fhData);
        return window.spinner.stop();
      }
    });
    LegendView = app.LegendView = Backbone.View.extend({
      template: "#legendTemplate",
      events: {
        "click .onoffswitch-checkbox": function(e) {
          var apLayer, epLayer, layer, map, name, zIndex;
          e.stopPropagation();
          map = app.map;
          name = $(e.currentTarget).data('layer');
          layer = app.layers[name];
          apLayer = app.layers['apLayer'];
          epLayer = app.layers['epLayer'];
          if ($(e.currentTarget).is(':checked')) {
            if (!app.map.hasLayer(layer)) {
              if (name === 'apLayer') {
                zIndex = 3;
              }
              if (name === 'epLayer') {
                zIndex = 4;
              }
              if (name === 'floods') {
                zIndex = 2;
              }
              if (app.map.getZoom() >= 11 && name === 'epLayer') {
                app.map.removeLayer(apLayer);
                map.addLayer(epLayer, 3);
                if ($('input[data-layer=apLayer]').prop('checked')) {
                  return map.addLayer(apLayer(4));
                }
              } else if (app.map.getZoom() <= 10 && name === 'apLayer') {
                if (map.hasLayer(epLayer)) {
                  app.map.removeLayer(epLayer);
                  map.addLayer(apLayer, zIndex);
                  return map.addLayer(epLayer, zIndex);
                } else {
                  return map.addLayer(app.layers['apLayer'], zIndex);
                }
              } else {
                return map.addLayer(layer, zIndex);
              }
            }
          } else {
            if (map.hasLayer(layer)) {
              return map.removeLayer(layer);
            }
          }
        }
      },
      afterRender: function() {
        var apGrades, labels, options, self;
        self = this;
        apGrades = _.range(1, 11, 1);
        labels = [];
        options = {
          placement: "auto"
        };
        $("#legend h3").tooltip(options);
        $(apGrades).each(function(index) {
          var apValue, textNode;
          apValue = $("<div><i style=\"background:" + app.getColor("ap", this) + ";\"></i></div>");
          if (index % 4 === 0) {
            textNode = "<span>+" + this + "%</span>";
            apValue.append(textNode);
          }
          return self.$el.find(".apRange").append(apValue);
        });
        self.$el.find(".apRange").append("<div class='bottom-line'>increasing annual precipitation</div>");
        return self.$el.appendTo(layout.$el.find('#legend'));
      }
    });
    FloatLayout = app.FloatLayout = Backbone.Layout.extend({
      template: "#floatLayout",
      views: {
        'header': new HeaderView(),
        'map': new MapView(),
        'legend': new LegendView()
      }
    });
    layout = app.layout = new FloatLayout();
    layout.$el.appendTo('#main');
    return layout.render();
  });

}).call(this);

//# sourceMappingURL=main.js.map
