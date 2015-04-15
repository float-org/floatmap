
/*
 TO DO
  - Move GeoModel code to separate file
  - Separate out code into better named methods
  - Fix tooltips not rendering
  - Test popup w/ Elasticsearch
 */

(function() {
  var GeoCollection, GeoModel, Query;

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

  Query = Backbone.Model.extend({
    defaults: {
      ap: 0,
      ep: 0,
      flood: 0,
      overall_risk: 'unknown'
    },
    url: '/get_queries/'
  });

  $(function() {
    var DataTourView, FloatLayout, HeaderView, LegendView, MapView, QueryView, WelcomeView, app, layers, layout;
    app = window.app = window.app || {};
    layers = app.layers = [];
    app.getPattern = function(type, d) {
      var pattern;
      if (type === 'ep') {
        if (d === null) {
          return false;
        }
        pattern = 'dots ';
        if (d <= 22) {
          pattern += 'low-mid';
        } else if (d >= 23 && d <= 33) {
          pattern += 'mid-high';
        } else if (d >= 34 && d <= 44) {
          pattern += 'high-extreme';
        } else if (d >= 45 && d <= 55) {
          pattern += 'extreme-severe';
        }
        return pattern;
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
      var opts, target;
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
      target = $(element)[0];
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
          return app.layout.views['map'].setAddress(latLng, 15);
        });
      },
      events: {
        "submit #search": function(e) {
          var address;
          e.preventDefault();
          address = $(e.target).find('.search-input').val();
          return this.getAddress(address);
        },
        "click #tourLink": function(e) {
          var dataTour, dataView;
          e.preventDefault();
          dataTour = new DataTourView();
          dataView = this.insertView('#dataTour', dataTour);
          return dataView.render();
        }
      }
    });
    DataTourView = app.DataTourView = Backbone.View.extend({
      initialize: function() {
        if (window.tour) {
          window.tour.complete();
        }
        return window.tour = this.tour = new Shepherd.Tour({
          defaults: {
            classes: 'shepherd-theme-arrows',
            scrollTo: true
          }
        });
      },
      resetMapAfterTour: function() {
        if ($('.active-query')) {
          $('.active-query').removeClass('active-query');
        }
        app.map.setZoom(6);
        app.map.addLayer(floods, 1);
        $('#floods-switch').prop('checked', true);
        app.map.addLayer(ap, 2);
        $('#apLayer-switch').prop('checked', true);
        app.map.addLayer(ep, 3);
        $('#epLayer-switch').prop('checked', true);
        return tour.complete();
      },
      resetMapData: function() {
        var i, layer, len, ref;
        if ($('.active-query')) {
          $('.active-query').removeClass('active-query');
        }
        ref = [window.ap, window.ep, window.floods];
        for (i = 0, len = ref.length; i < len; i++) {
          layer = ref[i];
          app.map.removeLayer(layer);
        }
        $('#floods-switch').prop('checked', false);
        $('#apLayer-switch').prop('checked', false);
        return $('#epLayer-switch').prop('checked', false);
      },
      afterRender: function() {
        app.map.setZoom(6);
        this.resetMapData();
        $('#welcomeModal').modal('hide');
        $('#apLayer-switch').trigger('click');
        this.tour.addStep('ap-step', {
          title: 'Annual Precipitation',
          text: 'The Annual Precipitation layer shows how total rain and snowfall each year is projected to grow by the 2040-2070 period. More annual precipitation means more water going into rivers, lakes and snowbanks, a key risk factor for bigger floods. These projections come from the National Oceanic and Atmospheric Administration (2014).',
          attachTo: '#apLegendContainer top',
          buttons: [
            {
              text: 'Next',
              action: function() {
                $('#epLayer-switch').trigger('click');
                return tour.next();
              }
            }
          ]
        });
        this.tour.addStep('ep-step', {
          title: 'Storm Frequency',
          text: 'The Storm Frequency layer shows how days with heavy rain or snow (over 1 inch per day) are projected to come more often by the 2040-2070 period. More storm frequency means more rapid surges of water into rivers and lakes, a key risk factor for more frequent flooding. These projections also come from the National Oceanic and Atmospheric Administration (2014).',
          attachTo: '#epLegendContainer top',
          buttons: [
            {
              text: 'Next',
              action: function() {
                $('#floods-switch').trigger('click');
                return tour.next();
              }
            }
          ]
        });
        this.tour.addStep('flood-step', {
          title: 'Flood Zones',
          text: 'The Flood Zones show the areas that already are at major risk for flooding, based on where floods have historically reached. If floods become larger and more frequent, many neighboring areas to these historical flood zones are likely to start experience flooding. This information comes from the Federal Emergency Management Administration (2014).',
          attachTo: '#floodsLegendContainer top',
          buttons: [
            {
              text: 'Next',
              action: tour.next
            }
          ]
        });
        this.tour.addStep('search-step', {
          title: 'Search',
          text: 'Use the search bar to see the risks for a specific location. Try using the search bar now to find a location you care about in the Midwest.',
          attachTo: '.search-input bottom',
          buttons: [
            {
              text: 'Next',
              action: function() {
                $('#queryToggle').trigger('click');
                return setTimeout(function() {
                  return tour.next();
                }, 450);
              }
            }
          ]
        });
        this.tour.addStep('query-step', {
          title: 'Query',
          text: 'Right click anywhere on the map to see the numbers for that specific place, or take a tour of some communities at high risk for worsened flooding.',
          attachTo: '#queryContent left',
          buttons: [
            {
              text: 'Take a Tour',
              action: function() {
                var latlng, marker;
                latlng = [44.519, -88.019];
                app.map.setView(latlng, 13);
                if (app.map.marker) {
                  app.map.removeLayer(app.map.marker);
                }
                marker = app.map.marker = L.marker(latlng).addTo(app.map);
                return tour.next();
              }
            }, {
              text: 'Stop Tour',
              action: this.resetMapAfterTour
            }
          ]
        });
        this.tour.addStep('map-lambeau', {
          title: 'Green Bay, WI',
          text: 'The home of the Packers has a large neighborhood of paper plants and homes at high risk of worsened flooding, with storm days increasing nearly 40% and annual precipitation rising 10% in the next few decades.',
          attachTo: '|#queryContent bottom',
          buttons: [
            {
              text: 'Continue',
              action: function() {
                var latlng, marker;
                latlng = [43.1397, -89.3375];
                app.map.setView(latlng, 13);
                if (app.map.marker) {
                  app.map.removeLayer(app.map.marker);
                }
                marker = app.map.marker = L.marker(latlng).addTo(app.map);
                return tour.next();
              }
            }, {
              text: 'Stop Tour',
              action: this.resetMapAfterTour
            }
          ]
        });
        this.tour.addStep('map-dane', {
          title: 'Madison, WI Airport',
          text: 'Airports are often built on flat areas near rivers, placing them at serious risk of flooding, like Madison’s main airport, serving 1.6 million passengers per year.',
          attachTo: '|#queryContent bottom',
          buttons: [
            {
              text: 'Continue',
              action: function() {
                var latlng, marker;
                latlng = [42.732072157891224, -84.50576305389404];
                app.map.setView([42.73591782230738, -84.48997020721437], 13);
                if (app.map.marker) {
                  app.map.removeLayer(app.map.marker);
                }
                marker = app.map.marker = L.marker(latlng).addTo(app.map);
                return tour.next();
              }
            }, {
              text: 'Stop Tour',
              action: this.resetMapAfterTour
            }
          ]
        });
        this.tour.addStep('map-lansing', {
          title: 'Lansing, MI',
          text: 'A large stretch of downtown businesses and homes are at risk of worsened flooding, as well as part of the Michigan State campus.',
          attachTo: '|#queryContent bottom',
          buttons: [
            {
              text: 'Continue',
              action: function() {
                var latlng, marker;
                latlng = [41.726, -90.310];
                app.map.setView([41.7348457153312, -90.310], 13);
                if (app.map.marker) {
                  app.map.removeLayer(app.map.marker);
                }
                marker = app.map.marker = L.marker(latlng).addTo(app.map);
                return tour.next();
              }
            }, {
              text: 'Stop Tour',
              action: this.resetMapAfterTour
            }
          ]
        });
        this.tour.addStep('map-quadcities', {
          title: 'Quad Cities Nuclear Generating Station',
          text: 'Power plants, including nuclear plants like the one here, are frequently built on riverbanks to use water for cooling. Larger, more frequent future floods could place these power plants and their communities at risk.',
          attachTo: '|#queryContent bottom',
          buttons: [
            {
              text: 'Stop Tour',
              action: this.resetMapAfterTour
            }
          ]
        });
        return this.tour.start();
      }
    });
    WelcomeView = app.WelcomeView = Backbone.View.extend({
      template: "#welcomeTemplate",
      events: {
        'click #startDataTour': function(e) {
          var dataTour, dataView;
          e.preventDefault();
          dataTour = new DataTourView();
          dataView = this.insertView('#dataTour', dataTour);
          return dataView.render();
        },
        'shown.bs.modal #welcomeModal': function(e) {
          return this.reposition();
        },
        'click #closeModal': function(e) {
          if ($('.active-query')) {
            $('.active-query').removeClass('active-query');
          }
          app.map.addLayer(floods, 1);
          $('#floods-switch').prop('checked', true);
          app.map.addLayer(ap, 2);
          $('#apLayer-switch').prop('checked', true);
          app.map.addLayer(ep, 3);
          return $('#epLayer-switch').prop('checked', true);
        }
      },
      initialize: function(e) {
        var self;
        self = this;
        return $(window).on('resize', function(e) {
          return self.reposition();
        });
      },
      afterRender: function() {
        return $('#welcomeModal').modal({
          backdrop: 'static',
          keyboard: true
        }, 'show');
      },
      reposition: function() {
        var dialog, modal;
        modal = this.$el;
        dialog = modal.find('.modal-dialog');
        modal.css('display', 'block');
        return dialog.css("margin-top", Math.max(0, ($(window).height() - dialog.height()) / 2));
      }
    });
    MapView = app.MapView = Backbone.View.extend({
      template: "#mapTemplate",
      el: false,
      setEvents: function() {
        var self;
        self = this;
        app.map.on('contextmenu', function(e) {
          var latLng;
          latLng = [e.latlng.lat, e.latlng.lng];
          return app.layout.views['map'].setAddress(latLng, app.map.getZoom());
        });
        app.map.on('zoomstart', function(e) {
          return self.previousZoom = app.map.getZoom();
        });
        return app.map.on('zoomend', function(e) {
          var map;
          map = app.map;
          if (map.getZoom() < this.previousZoom && this.previousZoom === 15) {
            return map.removeLayer(window.marker);
          }
        });
      },
      addLayer: function(layer, zIndex) {
        return layer.setZIndex(zIndex).addTo(app.map);
      },
      setAddress: function(latlng, zoom) {
        var lnglat;
        app.map.setView(latlng, zoom);
        lnglat = [latlng[1], latlng[0]];
        return app.layout.views['#legend'].views['#query'].getQuery(lnglat);
      },
      makeGeoJSONLayer: function(data, type) {
        var layer, self;
        self = this;
        if (type === 'ap') {
          layer = app.layers['apLayer'] = L.geoJson(data, {
            renderer: app.map.renderer,
            style: function(feature, layer) {
              return {
                className: 'ap',
                color: app.getColor("ap", feature.properties.DN)
              };
            }
          });
        } else if (type === 'ep') {
          layer = app.layers['epLayer'] = L.geoJson(data, {
            renderer: app.map.renderer,
            style: function(feature, layer) {
              return {
                className: app.getPattern("ep", feature.properties.DN) + " ep"
              };
            },
            filter: function(feature, layer) {
              if (feature.properties.DN === null) {
                return false;
              } else {
                return true;
              }
            }
          });
        }
        return layer;
      },
      renderTemplate: function() {
        var ap, base, baseURL, ep, floods, labels, labelsURL, map;
        baseURL = '//{s}.tiles.mapbox.com/v3/floatmap.2ce887fe/{z}/{x}/{y}.png';
        labelsURL = '//{s}.tiles.mapbox.com/v3/floatmap.2b5f6c80/{z}/{x}/{y}.png';
        if (!app.map) {
          map = app.map = new L.Map('map', {
            zoomControl: false
          }).setView([43.05358653605547, -89.2815113067627], 6);
        }
        map.renderer = L.svg({
          pane: 'tilePane'
        }).addTo(map);
        base = window.base = app.layers['base'] = L.tileLayer(baseURL, {
          pane: 'tilePane',
          maxZoom: 15,
          minZoom: 5
        });
        floods = window.floods = app.layers['floods'] = L.tileLayer('/static/nfhl_tiles/{z}/{x}/{y}.png', {
          pane: 'tilePane',
          maxZoom: 15,
          minZoom: 5,
          errorTileUrl: '#'
        });
        labels = window.labels = app.layers['labels'] = L.tileLayer(labelsURL, {
          pane: 'tilePane',
          maxZoom: 15,
          minZoom: 5
        });
        ap = window.ap = this.makeGeoJSONLayer(window.apData, 'ap');
        ep = window.ep = this.makeGeoJSONLayer(window.epData, 'ep');
        this.addLayer(base, 0);
        if ($.cookie('welcomed')) {
          this.addLayer(floods, 1);
          this.addLayer(ap, 2);
          this.addLayer(ep, 3);
        }
        this.addLayer(labels, 4);
        map.addControl(L.control.zoom({
          position: "bottomleft"
        }));
        return this.setEvents();
      }
    });
    QueryView = app.QueryView = Backbone.View.extend({
      template: "#queryTemplate",
      events: {
        "click #queryToggle": function(e) {
          return app.layout.views['#legend'].$el.toggleClass('active-query');
        }
      },
      initialize: function() {
        this.model = new Query();
        return this.listenTo(this.model, "change", this.render);
      },
      serialize: function() {
        return {
          query: this.model.attributes
        };
      },
      getQuery: function(lnglat) {
        var self, spinner;
        spinner = app.createSpinner("#queryContent");
        self = this;
        return this.model.fetch({
          data: {
            lng: lnglat[0],
            lat: lnglat[1]
          },
          type: 'POST',
          success: function(model, response) {
            setTimeout(function() {
              return app.layout.views['#legend'].$el.addClass('active-query');
            }, 100);
            return spinner.stop();
          },
          error: function(model, response) {
            return spinner.stop();
          },
          complete: function(model, response) {
            return spinner.stop();
          }
        });
      }
    });
    LegendView = app.LegendView = Backbone.View.extend({
      template: "#legendTemplate",
      events: {
        "click #legend": function(e) {
          return e.stopPropagation();
        },
        "click .onoffswitch-checkbox": function(e) {
          var current_ap, current_ep, layer, map, name;
          e.stopPropagation();
          map = app.map;
          name = $(e.currentTarget).data('layer');
          layer = app.layers[name];
          current_ap = app.layers['apLayer'];
          current_ep = app.layers['epLayer'];
          if ($(e.currentTarget).is(':checked')) {
            if (layer === current_ap) {
              if (map.hasLayer(current_ep)) {
                map.removeLayer(current_ap);
                map.removeLayer(current_ep);
                map.addLayer(window.ap, 2);
                return map.addLayer(window.ep, 3);
              } else {
                return map.addLayer(window.ap, 2);
              }
            } else if (layer === current_ep) {
              return map.addLayer(window.ep);
            } else {
              return map.addLayer(layer);
            }
          } else {
            if (map.hasLayer(layer)) {
              return map.removeLayer(layer);
            }
          }
        }
      },
      views: {
        '#query': new QueryView()
      },
      afterRender: function() {
        var apGrades, labels, self;
        self = this;
        apGrades = _.range(0, 13, 1);
        labels = [];
        $(apGrades).each(function(index) {
          var apValue, textNode;
          apValue = $("<div><i style=\"background:" + app.getColor("ap", this) + "\"></i></div>");
          if (index % 4 === 0) {
            textNode = "<span>+" + this + "%</span>";
            apValue.append(textNode);
          }
          return self.$el.find(".apRange").append(apValue);
        });
        self.$el.find(".apRange").append("<div class='bottom-line'>increasing annual precipitation</div>");
        self.$el.appendTo(layout.$el.find('#legend'));
        if ($.cookie('welcomed')) {
          $('#floods-switch').prop('checked', true);
          $('#apLayer-switch').prop('checked', true);
          $('#epLayer-switch').prop('checked', true);
        }
        return $("[data-toggle=tooltip]").tooltip({
          placement: 'right'
        });
      }
    });
    FloatLayout = app.FloatLayout = Backbone.Layout.extend({
      template: "#floatLayout",
      initialize: function() {
        var welcome;
        welcome = new WelcomeView();
        if (!$.cookie('welcomed')) {
          this.insertView('#welcome', welcome);
          return $.cookie('welcomed', true);
        }
      },
      views: {
        '#header': new HeaderView(),
        'map': new MapView(),
        '#legend': new LegendView()
      }
    });
    layout = app.layout = new FloatLayout();
    layout.$el.appendTo('#main');
    layout.render();
    return $(window).load(function() {
      return $("img").each(function() {
        var $this;
        $this = $(this);
        return this.onerror = function() {
          return $this.hide();
        };
      });
    });
  });

}).call(this);

//# sourceMappingURL=main.js.map
