import React from 'react';
import $ from 'jquery';
import L from 'leaflet';
import 'jquery.cookie';
import { getColor, getPattern } from '../utils';
import { topojson } from '../vendor/leaflet-omnivore';

/**
 * Class representing map layout component for Float Map
 * @extends React.Component
 */
class Map extends React.Component {

    /**
     * Create Base Component, instantiating State and binding
     * event handlers
     * @param {Object} Props - Props passed into component
     */
    constructor(props) {
      super(props);
    }

    /**
     * Set up non-React events
     */
    _setEvents() {
      // For Debugging
      // application.map.on 'click', (e) ->
      //    alert("Lat, Lng : " + e.latlng.lat + ", " + e.latlng.lng)

      // on right click, trigger a query from Base component
      application.map.on('contextmenu', (e) => {
        if (!$('.legend-wrapper').hasClass('active')) {
          $('.component-legend-toggle').trigger('click');
        }

        return this.props.onQuery(e.latlng);
      });
    }

    /**
     * Add layer to map
     * @param {Undefined}
     */
    _addLayer(layer) {
      return layer.addTo(application.map);
    }

    /**
    * Based on data type, creates geoJSON layer
    * and styles appropriately, based on features
    * @param {Object} data - data to convert to geoJSON layer
    * @param {String} type - type of data we are converting
    * @return {Object} geoJSON layer
    * @TODO worth breaking up function more?
    */
    _makegeoJsonLayer(data, type) {
      let self = this;
      if (type === 'ap') {
        var layer;
        return layer = application.layers['annual-precipitation'] = application.gjLayers['annual-precipitation'] = L.geoJson(data, {
          renderer: application.map.dataLayers,
          pane: 'dataLayers',
          style(feature, layer) {
            return {
              className: 'ap',
              color: getColor("ap", feature.properties.DN)
            };
          }
        });

      } else if (type === 'ep') {
        var layer;
        return layer = application.layers['storm-frequency'] = application.gjLayers['storm-frequency'] = L.geoJson(data, {
          renderer: application.map.dataLayers,
          pane: 'dataLayers',
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
          renderer: application.map.countries,
          pane: 'countries',
          style(feature, layer) {
            return {className: "no-data-yet"};
          }
        });

        return layer = application.layers[type] = topojson(data, null, config);
      }
    }

    /**
     * Clear layers from map
     * @param {Undefined}
     */
    _clearLayers() {
      application.map.eachLayer(function (layer) {
        application.map.removeLayer(layer);
      });
    }

    /**
     * Add ONLY data layers to map
     * @param {Undefined}
     */
    _renderDataLayers() {
      application.map.removeLayer(ap);
      application.map.removeLayer(ep);
      application.map.removeLayer(floods);

      if (this.props.layers.showFloodZones) {
        this._addLayer(floods);
      }

      if (this.props.layers.showAnnualPrecipitation) {
        this._addLayer(ap);
      }

      if (this.props.layers.showStormFrequency) {
        this._addLayer(ep);
      }


    }

    /**
     * React Lifecycle Event - called before component is mounted/rendered
     * @instance
     */
    componentWillMount() {
      // Our layers object, which will contain all of the data layers
      // TODO: This seems like something Leaflet should be able to handle but I don't know...
      let layers = application.layers = {};
      let gjLayers = application.gjLayers = {};
    }

    /**
     * React Lifecycle Event - component state/whatever has updated
     * @instance
     */
    componentDidUpdate() {
      let labelsURL = '//{s}.tiles.mapbox.com/v3/floatmap.2b5f6c80/{z}/{x}/{y}.png';

      this._renderDataLayers();

      const { center, zoom } = this.props;
      application.map.setView(center, zoom);

      const defaultIcon = L.icon({
        iconUrl: 'static/img/marker-icon.png',
        shadowUrl: 'static/img/marker-shadow.png'
      });

      if (application.map.marker) {
        application.map.removeLayer(application.map.marker);
      }

      let marker = application.map.marker = L.marker(this.props.center, { icon: defaultIcon }).addTo(application.map);

      let lnglat = [this.props.center[1], this.props.center[0]];
    }

    /**
     * React Lifecycle Event - component has been inserted into DOM
     * @instance
     */
    componentDidMount() {
      let southWest = L.latLng(30.85343961959182, -123.1083984375);
      let northEast = L.latLng(56.12057809796008, -60.40917968750001);
      let bounds = L.latLngBounds(southWest, northEast);
      let center = L.latLng(this.props.center[0], this.props.center[1]);
      let mapContainer = document.querySelector('.component-map');
      var map = application.map = new L.Map(mapContainer, {maxBounds: bounds, minZoom: 5, maxZoom: 15, zoom: this.props.zoom, center, attributionControl: false});
      map.createPane('base');
      map.createPane('countries');
      map.createPane('dataLayers');
      map.createPane('labels');

      map.getPane('base').style.zIndex = 1;
      map.getPane('countries').style.zIndex = 2;
      map.getPane('dataLayers').style.zIndex = 3;
      map.getPane('labels').style.zIndex = 4;

      // Create new SVG renderer and add to Tile pane, so we can work with geoJson like other layers
      map.dataLayers = L.svg({pane:'dataLayers'}).addTo(map);
      map.countries = L.svg({pane:'countries'}).addTo(map);

      // Path to Base layer (no labels)
      let baseURL = '//{s}.tiles.mapbox.com/v3/floatmap.2ce887fe/{z}/{x}/{y}.png';
      // Path to Base layer labels, overlaget last
      let labelsURL = '//{s}.tiles.mapbox.com/v3/floatmap.2b5f6c80/{z}/{x}/{y}.png';
      let base = window.base = application.layers['base'] = L.tileLayer(baseURL, {pane: 'base'});
      let floods = window.floods = application.layers['flood-zones'] = L.tileLayer('/static/nfhl_tiles/{z}/{x}/{y}.png', {pane: 'dataLayers', errorTileUrl: 'http://i.imgur.com/aZejCgY.png'});

      let labels = window.labels = application.layers['labels'] = L.tileLayer(labelsURL, {pane: 'labels'});
      let ap = window.ap = this._makegeoJsonLayer(window.apData, 'ap');
      let ep = window.ep = this._makegeoJsonLayer(window.epData, 'ep');

      let usNoData = window.usNoData = this._makegeoJsonLayer("static/geojson/regions/US_no_data_topo.geojson", 'usNoData');
      let canada = window.canada = this._makegeoJsonLayer("static/geojson/regions/canada_topo.geojson", 'canada');
      let mexico = window.mexico = this._makegeoJsonLayer("static/geojson/regions/mexico_topo.geojson", 'mexico');

      this._addLayer(base);

      if ($.cookie('welcomed')) {
        this._renderDataLayers();
      }

      this._addLayer(labels);
      this._addLayer(usNoData);
      this._addLayer(canada);
      this._addLayer(mexico);

      // Then we add zoom controls and finally set off event listeners
      map.addControl(L.control.zoom({position: "bottomleft"}));
      return this._setEvents();
    }

    /**
     * React Lifecycle Event - component renders
     * @instance
     */
    render() {
      return (
        <div className='component-map' />
      )
    }
  }

module.exports = Map;
