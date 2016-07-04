import $ from 'jquery';
import L from '../vendor/leaflet';
import 'jquery.cookie';
import { getColor, getPattern } from '../utils';

Backbone.Layout.configure({
  manage: true
});

let MapView = application.MapView = Backbone.View.extend({
    template: "#mapTemplate",
    el: false,

    initialize() {
      // Our layers object, which will contain all of the data layers
      // TODO: This seems like something Leaflet should be able to handle but I don't know...
      let layers = application.layers = {};
      let gjLayers = application.gjLayers = {};
    },

    setEvents() {
      // For Debugging
      // application.map.on 'click', (e) ->
      //    alert("Lat, Lng : " + e.latlng.lat + ", " + e.latlng.lng)

      let self = this;

      // When a user right clicks, trigger a query in Elasticsearch for the coords at the click.
      application.map.on('contextmenu', function(e) {
        if (!$('.legend-wrapper').hasClass('active')) {
          $('#legend-toggle').trigger('click');
        }
        return application.layout.views['#legend'].views['#query'].handleQuery(e.latlng);
      });

      // When zoom begins, get the current zoom and cache for later.
      application.map.on('zoomstart', e => self.previousZoom = application.map.getZoom());

      // When zoom is over, remove marker if we're leaving the max zoom layer.
      return application.map.on('zoomend', function(e) {
        let { map } = application;
        if (map.getZoom() < this.previousZoom && this.previousZoom === 15) { return map.removeLayer(window.marker); }
      });
    },

    // Fairly self-descriptive
    addLayer(layer, zIndex) {
      return layer.setZIndex(zIndex).addTo(application.map);
    },

    setAddress(latlng, zoom) {
      application.map.setView(latlng, zoom);
      // Note that geoJson expects Longitude first (as x) and Latitude second (as y), so we have to switch the order
      let lnglat = [latlng[1], latlng[0]];
      return application.layout.views['#legend'].views['#query'].handleQuery(lnglat);
    },

    // Based on data type, creates geoJSON layer
    // and styles appropriately, based on features
    makegeoJsonLayer(data, type) {
      let self = this;
      if (type === 'ap') {
        var layer;
        return layer = application.layers['apLayer'] = application.gjLayers['apLayer'] = L.geoJson(data, {
          renderer: application.map.renderer,
          style(feature, layer) {
            return {
              className: 'ap',
              color: getColor("ap", feature.properties.DN)
            };
          }
        });

      } else if (type === 'ep') {
        var layer;
        return layer = application.layers['epLayer'] = application.gjLayers['epLayer'] = L.geoJson(data, {
          renderer: application.map.renderer,
          style(feature, layer) {
            return {className: getPattern("ep", feature.properties.DN) + " ep"};
          },
          filter(feature, layer) {
            if (feature.properties.DN === null) {
              return false;
            } else {
              return true;
            }
          }
        });
      } else {
        var layer;
        let config = L.geoJson(null, {
          renderer: application.map.renderer,
          style(feature, layer) {
            return {className: "no-data-yet"};
          }
        });

        return layer = application.layers[type] = omnivore.topojson(data, null, config);
      }
    },

    renderTemplate() {
      // Path to Base layer (no labels)
      let baseURL = '//{s}.tiles.mapbox.com/v3/floatmap.2ce887fe/{z}/{x}/{y}.png';

      // Path to Base layer labels, overlaid last
      let labelsURL = '//{s}.tiles.mapbox.com/v3/floatmap.2b5f6c80/{z}/{x}/{y}.png';

      // Instantiate map if we haven't
      if (!application.map) {
        let southWest = L.latLng(30.85343961959182, -123.1083984375);
        let northEast = L.latLng(56.12057809796008, -60.40917968750001);
        let center = L.latLng(44.2205730390537, -88);
        let bounds = L.latLngBounds(southWest, northEast);
        var map = application.map = new L.Map('map', {maxBounds: bounds, minZoom: 5, maxZoom: 15, zoom: 6, center, attributionControl: false});
      }


      // Create new SVG renderer and add to Tile pane, so we can work with geoJson like other layers
      map.renderer = L.svg({pane:'tilePane'}).addTo(map);

      // We're only dealing with the Midwest for now, so bound our
      // tile layer queries.
      // TODO: Determine a better way to have a more precise set of bounds

      // Create our layers
      let base = window.base = application.layers['base'] = L.tileLayer(baseURL, {pane: 'tilePane'});
      let floods = window.floods = application.layers['floods'] = L.tileLayer('/static/nfhl_tiles/{z}/{x}/{y}.png', {pane: 'tilePane', errorTileUrl: 'http://i.imgur.com/aZejCgY.png'});
      let labels = window.labels = application.layers['labels'] = L.tileLayer(labelsURL, {pane: 'tilePane'});

      let ap = window.ap = this.makegeoJsonLayer(window.apData, 'ap');
      let ep = window.ep = this.makegeoJsonLayer(window.epData, 'ep');
      let usNoData = window.usNoData = this.makegeoJsonLayer("static/geojson/regions/US_no_data_topo.geojson", 'usNoData');
      let canada = window.canada = this.makegeoJsonLayer("static/geojson/regions/canada_topo.geojson", 'canada');
      let mexico = window.mexico = this.makegeoJsonLayer("static/geojson/regions/mexico_topo.geojson", 'mexico');

      // ...and then append them to the map, in order!
      // TODO: Why doesn't zindex work with geoJson layers?
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


      // Then we add zoom controls and finally set off event listeners
      map.addControl(L.control.zoom({position: "bottomleft"}));
      return this.setEvents();
    }
  });

export default MapView;
