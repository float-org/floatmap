
/*
 TO DO
  - Move GeoModel code to separate file
  - Separate out code into better named methods
  - Fix tooltips not rendering
  - Test popup w/ Elasticsearch
 */

(function() {
  var Query;

  Query = Backbone.Model.extend({
    defaults: {
      ap: "",
      ep: ""
    }
  });

  $(function() {
    var DataTourView, FloatLayout, HeaderView, LegendView, MapView, QueryView, ShareView, WelcomeView, app, defaultIcon, layout;
    defaultIcon = L.icon({
      iconUrl: 'static/img/marker-icon.png',
      shadowUrl: 'static/img/marker-shadow.png'
    });
    app = window.app = window.app || {};
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
        rainbow.setSpectrum('#94FFDB', '#0003FF');
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
    HeaderView = app.HeaderView = Backbone.View.extend({
      template: "#headerTemplate",
      getAddress: function(address) {
        var g;
        g = new google.maps.Geocoder();
        return g.geocode({
          address: address
        }, function(results, status) {
          var latLng, marker;
          latLng = [results[0].geometry.location.lat(), results[0].geometry.location.lng()];
          app.layout.views['map'].setAddress(latLng, 15);
          if (app.map.marker) {
            app.map.removeLayer(app.map.marker);
          }
          marker = app.map.marker = L.marker(latLng, {
            icon: defaultIcon
          }).addTo(app.map);
          if ($("button.navbar-toggle").is(":visible")) {
            return $("button.navbar-toggle").trigger("click");
          }
        });
      },
      events: {
        "submit #search": function(e) {
          var address;
          e.preventDefault();
          address = $(e.target).find('.search-input').val();
          return this.getAddress(address);
        },
        "submit #searchMobile": function(e) {
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
          if (app.map.marker) {
            app.map.removeLayer(app.map.marker);
          }
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
        if (app.map.marker) {
          app.map.removeLayer(app.map.marker);
        }
        if ($('.active')) {
          $('.active').removeClass('active').promise().done(function() {
            return $('.legend-wrapper').addClass('invisible');
          });
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
        var j, layer, len, ref;
        if ($('.active')) {
          $('.active').removeClass('active').promise().done(function() {
            return $('.legend-wrapper').addClass('invisible');
          });
        }
        ref = [window.ap, window.ep, window.floods];
        for (j = 0, len = ref.length; j < len; j++) {
          layer = ref[j];
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
        $('#legend-toggle').trigger('click');
        L.Icon.Default.imagePath = "../static/img";
        $('#apLayer-switch').trigger('click');
        this.tour.addStep('ap-step', {
          title: 'Annual Precipitation',
          text: 'The Annual Precipitation layer shows how total rain and snowfall each year is projected to grow by the 2040-2070 period. More annual precipitation means more water going into rivers, lakes and snowbanks, a key risk factor for bigger floods. These projections come from the National Oceanic and Atmospheric Administration (2014).',
          attachTo: '#apToggle top',
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
          attachTo: '#stormsToggle top',
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
          attachTo: '#floodZonesToggle top',
          buttons: [
            {
              text: 'Next',
              action: tour.next
            }
          ]
        });
        this.tour.addStep('search-step', {
          title: 'Search',
          text: 'Search for a specific address, city or landmark. Try using the search bar now to find a location you care about in the Midwest.',
          attachTo: '.search-input bottom',
          buttons: [
            {
              text: 'Next',
              action: function() {
                return setTimeout(function() {
                  return tour.next();
                }, 450);
              }
            }
          ]
        });
        this.tour.addStep('query-step', {
          title: 'Inspect',
          text: '<p>Right click anywhere on the map to inspect the numbers for that specific place.</p><br /><p>Take a tour of some communities at high risk for worsened flooding.</p>',
          attachTo: '#query left',
          buttons: [
            {
              text: 'Take a Tour',
              action: function() {
                var latlng, marker;
                latlng = [44.519, -88.019];
                app.layout.views['map'].setAddress(latlng, 13);
                if (app.map.marker) {
                  app.map.removeLayer(app.map.marker);
                }
                marker = app.map.marker = L.marker(latlng, {
                  icon: defaultIcon
                }).addTo(app.map);
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
          attachTo: '.leaflet-marker-icon left',
          buttons: [
            {
              text: 'Continue',
              action: function() {
                var latlng, marker;
                latlng = [43.1397, -89.3375];
                app.layout.views['map'].setAddress(latlng, 13);
                if (app.map.marker) {
                  app.map.removeLayer(app.map.marker);
                }
                marker = app.map.marker = L.marker(latlng, {
                  icon: defaultIcon
                }).addTo(app.map);
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
          attachTo: '.leaflet-marker-icon left',
          buttons: [
            {
              text: 'Continue',
              action: function() {
                var latlng, marker;
                latlng = [42.732072157891224, -84.50576305389404];
                app.layout.views['map'].setAddress([42.73591782230738, -84.48997020721437], 13);
                if (app.map.marker) {
                  app.map.removeLayer(app.map.marker);
                }
                marker = app.map.marker = L.marker(latlng, {
                  icon: defaultIcon
                }).addTo(app.map);
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
          attachTo: '.leaflet-marker-icon left',
          buttons: [
            {
              text: 'Continue',
              action: function() {
                var latlng, marker;
                latlng = [41.726, -90.310];
                app.layout.views['map'].setAddress([41.7348457153312, -90.310], 13);
                if (app.map.marker) {
                  app.map.removeLayer(app.map.marker);
                }
                marker = app.map.marker = L.marker(latlng, {
                  icon: defaultIcon
                }).addTo(app.map);
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
          attachTo: '.leaflet-marker-icon bottom',
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
      initialize: function() {
        var gjLayers, layers;
        layers = app.layers = {};
        return gjLayers = app.gjLayers = {};
      },
      setEvents: function() {
        var self;
        self = this;
        app.map.on('contextmenu', function(e) {
          if (!$('.legend-wrapper').hasClass('active')) {
            $('#legend-toggle').trigger('click');
          }
          return app.layout.views['#legend'].views['#query'].handleQuery(e.latlng);
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
        return app.layout.views['#legend'].views['#query'].handleQuery(lnglat);
      },
      makegeoJsonLayer: function(data, type) {
        var config, layer, self;
        self = this;
        if (type === 'ap') {
          return layer = app.layers['apLayer'] = app.gjLayers['apLayer'] = L.geoJson(data, {
            renderer: app.map.renderer,
            style: function(feature, layer) {
              return {
                className: 'ap',
                color: app.getColor("ap", feature.properties.DN)
              };
            }
          });
        } else if (type === 'ep') {
          return layer = app.layers['epLayer'] = app.gjLayers['epLayer'] = L.geoJson(data, {
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
        } else {
          config = L.geoJson(null, {
            renderer: app.map.renderer,
            style: function(feature, layer) {
              return {
                className: "no-data-yet"
              };
            }
          });
          return layer = app.layers[type] = omnivore.topojson(data, null, config);
        }
      },
      renderTemplate: function() {
        var ap, base, baseURL, bounds, canada, center, ep, floods, labels, labelsURL, map, mexico, northEast, southWest, usNoData;
        baseURL = '//{s}.tiles.mapbox.com/v3/floatmap.2ce887fe/{z}/{x}/{y}.png';
        labelsURL = '//{s}.tiles.mapbox.com/v3/floatmap.2b5f6c80/{z}/{x}/{y}.png';
        if (!app.map) {
          southWest = L.latLng(30.85343961959182, -123.1083984375);
          northEast = L.latLng(56.12057809796008, -60.40917968750001);
          center = L.latLng(44.2205730390537, -88);
          bounds = L.latLngBounds(southWest, northEast);
          map = app.map = new L.Map('map', {
            maxBounds: bounds,
            minZoom: 5,
            maxZoom: 15,
            zoom: 6,
            center: center,
            attributionControl: false
          });
        }
        map.renderer = L.svg({
          pane: 'tilePane'
        }).addTo(map);
        base = window.base = app.layers['base'] = L.tileLayer(baseURL, {
          pane: 'tilePane'
        });
        floods = window.floods = app.layers['floods'] = L.tileLayer('/static/nfhl_tiles/{z}/{x}/{y}.png', {
          pane: 'tilePane',
          errorTileUrl: 'http://i.imgur.com/aZejCgY.png'
        });
        labels = window.labels = app.layers['labels'] = L.tileLayer(labelsURL, {
          pane: 'tilePane'
        });
        ap = window.ap = this.makegeoJsonLayer(window.apData, 'ap');
        ep = window.ep = this.makegeoJsonLayer(window.epData, 'ep');
        usNoData = window.usNoData = this.makegeoJsonLayer("static/layers/US_no_data_topo.geojson", 'usNoData');
        canada = window.canada = this.makegeoJsonLayer("static/layers/canada_topo.geojson", 'canada');
        mexico = window.mexico = this.makegeoJsonLayer("static/layers/mexico_topo.geojson", 'mexico');
        this.addLayer(base, 0);
        if ($.cookie('welcomed')) {
          this.addLayer(floods, 2);
          this.addLayer(ap, 3);
          this.addLayer(ep, 4);
        }
        this.addLayer(labels, 5);
        this.addLayer(usNoData, 6);
        this.addLayer(canada, 6);
        this.addLayer(mexico, 6);
        map.addControl(L.control.zoom({
          position: "bottomleft"
        }));
        return this.setEvents();
      }
    });
    QueryView = app.QueryView = Backbone.View.extend({
      template: "#queryTemplate",
      initialize: function() {
        this.model = new Query();
        return this.listenTo(this.model, "change", this.render);
      },
      serialize: function() {
        return {
          query: this.model.attributes
        };
      },
      handleQuery: function(lnglat) {
        var i, match;
        i = 0;
        while (i < _.size(app.gjLayers)) {
          match = leafletPip.pointInLayer(lnglat, app.gjLayers[Object.keys(app.gjLayers)[i]], false);
          if (Object.keys(app.gjLayers)[i] === 'apLayer') {
            if (match.length) {
              this.model.set({
                'ap': match[0].feature.properties.DN + '%↑ Annual Precipitation'
              });
            } else {
              this.model.set({
                'ap': 'No average precipitation data yet.'
              });
            }
          }
          if (Object.keys(app.gjLayers)[i] === 'epLayer') {
            if (match.length) {
              this.model.set({
                'ep': match[0].feature.properties.DN + '%↑ Storm Frequency'
              });
            } else {
              this.model.set({
                'ep': 'No storm frequency data yet.'
              });
            }
          }
          i++;
        }
      },
      afterRender: function() {
        if (JSON.stringify(this.model.defaults) !== JSON.stringify(this.model.attributes)) {
          if (!$('.legend-wrapper').hasClass('active')) {
            $('#legend-toggle').trigger('click');
          }
          return setTimeout(function() {
            if (!$('#query').hasClass('active')) {
              return $('#query').addClass('active');
            }
          }, 200);
        }
      }
    });
    LegendView = app.LegendView = Backbone.View.extend({
      template: "#legendTemplate",
      events: {
        "click #legend-toggle": function(e) {
          if ($('.legend-wrapper').hasClass('active')) {
            $('.legend-wrapper').addClass('invisible');
            return setTimeout(function() {
              return $('.legend-wrapper, #legend-toggle, #legend').removeClass('active');
            }, 1);
          } else {
            $('.legend-wrapper, #legend-toggle, #legend').addClass('active');
            return setTimeout(function() {
              return $('.legend-wrapper').removeClass('invisible');
            }, 150);
          }
        },
        "click .switch-container": function(e) {
          var current_ap, current_ep, layer, map, name;
          e.stopPropagation();
          map = app.map;
          name = $(e.currentTarget).find('.ios-switch').data('layer');
          layer = app.layers[name];
          current_ap = app.layers['apLayer'];
          current_ep = app.layers['epLayer'];
          if ($(e.currentTarget).find('.ios-switch').is(':checked')) {
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
        var apGrades, div, i, j, labels, len, self, switches;
        self = this;
        apGrades = _.range(0, 13, 1);
        labels = [];
        switches = document.querySelectorAll('input[type="checkbox"].ios-switch');
        for (j = 0, len = switches.length; j < len; j++) {
          i = switches[j];
          div = document.createElement('div');
          div.className = 'switch';
          i.parentNode.insertBefore(div, i.nextSibling);
        }
        self.$el.find(".apRange").append("<div class='ap-values'></div>");
        $(apGrades).each(function(index) {
          var apValue, textNode;
          apValue = $("<div><i style=\"background:" + app.getColor("ap", this) + "\"></i></div>");
          if (index % 4 === 0) {
            textNode = "<span>+" + this + "%</span>";
            apValue.append(textNode);
          }
          return self.$el.find(".ap-values").append(apValue);
        });
        self.$el.find(".apRange").append("<div class='ap-arrow'></div>");
        self.$el.find(".apRange").append("<span class='ap-text'>Increasing Average Precipitation</span>");
        self.$el.appendTo(layout.$el.find('#legend'));
        $('#legend').on("click", function(e) {
          if ($('#legend').hasClass('active')) {

          } else {
            $('.legend-wrapper, #legend-toggle, #legend').addClass('active');
            return setTimeout(function() {
              return $('.legend-wrapper').removeClass('invisible');
            }, 150);
          }
        });
        if ($.cookie('welcomed')) {
          $('#floods-switch').prop('checked', true);
          $('#apLayer-switch').prop('checked', true);
          $('#epLayer-switch').prop('checked', true);
        }
        return $("[data-toggle=tooltip]").tooltip({
          placement: 'left'
        });
      }
    });
    ShareView = app.ShareView = Backbone.View.extend({
      template: "#shareTemplate",
      events: {
        "click #shareContent a": function(e) {
          e.preventDefault();
          return this.openPopup(e.target.href);
        }
      },
      openPopup: function(url) {
        return window.open(url, "window", "height = 500, width = 559, resizable = 0");
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
        '#legend': new LegendView(),
        '#share': new ShareView()
      }
    });
    layout = app.layout = new FloatLayout();
    layout.$el.appendTo('#main');
    return layout.render();
  });

}).call(this);

//# sourceMappingURL=main.js.map
