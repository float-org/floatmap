import $ from 'jquery';
import _ from 'underscore';
import React from 'react';
import leafletPip from 'leaflet-pip';
import Welcome from '../views/Welcome';
import Header from '../views/Header';
import Map from '../views/Map';
import Legend from '../views/Legend';
import Share from '../views/Share';
import Tour from '../views/Tour';
import About from '../views/About';

/**
 * Class representing base layout component for Float Map
 * @extends React.Component
 */
class Base extends React.Component {

  /**
   * Create Base Component, instantiating State and binding
   * event handlers
   * @param {Object} Props - Props passed into component
   */
  constructor(props) {
    super(props)
    this.state = {
      position: [44.2205730390537, -88],
      zoom: 6,
      isWelcomeOpen: true,
      isAboutOpen: false,
      isTourActive: false,
      layers: {
        showFloodZones: true,
        showStormFrequency: true,
        showAnnualPrecipitation: true
      },
      queryResult: {
        ap: "",
        ep: "",
        shouldDisplay: false
      },
      isMobileNavActive: false
    }
    this._handleSearch = this._handleSearch.bind(this);
    this._handleQuery = this._handleQuery.bind(this);
    this._handleSwitch = this._handleSwitch.bind(this);
    this._handleClose = this._handleClose.bind(this);
    this._handleContinue = this._handleContinue.bind(this);
    this._handleAboutClick = this._handleAboutClick.bind(this);
    this._handleTourClick = this._handleTourClick.bind(this);
    this._handleTourStart = this._handleTourStart.bind(this);
    this._handleComplete = this._handleComplete.bind(this);
    this._handleMobileToggle = this._handleMobileToggle.bind(this);
  }

  /**
   * Sends defined context down to child components
   * @return {Object} Context - context passed down to child compoennts
   */
  getChildContext() {
   return {
     _handleSwitch: this._handleSwitch.bind(this)
   }
 }

 /**
  * Set non-React events
  * @returns {Undefined}
  */
 _setEvents() {
   let { map } = application;
   // When zoom begins, get the current zoom and cache for later.
   application.map.on('zoomstart', (e) => {
     return this.previousZoom = map.getZoom();
   });

   // When zoom is over, remove marker if we're leaving the max zoom layer.
   application.map.on('zoomend', (e) => {
     const zoom = map.getZoom();
     if (zoom < this.previousZoom && this.previousZoom === 15) { return map.removeLayer(application.map.marker); }
     this.setState({
       zoom: zoom
     })
   });
 }

 _handleMobileToggle(e) {
   e.preventDefault();
   this.setState({
     isMobileNavActive: !this.state.isMobileNavActive
   })
 }

 /**
  * Set state of application for when tour begins
  * @returns {Undefined}
  */
 _handleTourStart() {
   const layers = {
     showAnnualPrecipitation: false,
     showStormFrequency: false,
     showFloodZones: false
   };

   this.setState({
     layers: layers
   });
 }

 /**
  * Handler for when tour ends
  * @returns {Undefined}
  */
 _handleComplete() {
   if (application.map.marker) {
     application.map.removeLayer(application.map.marker);
   }

   if ($('.active')) {
     $('.active').removeClass('active').promise().done(() => $('.legend-wrapper').addClass('invisible'));
   }

   $('.flood-zones input').prop('checked',true);
   $('.annual-precipitation input').prop('checked',true);
   $('.storm-frequency input').prop('checked',true);
   this.setState({
     isTourActive: false,
     showAnnualPrecipitation: true,
     showStormFrequency: true,
     showFloodZones: true,
     zoom: 6
   }, application.tour.complete);
 }

 /**
  * Set query state
  * @param {Object} query - query results from right click or search
  * @param {Array} lnglat - position of place that was queried for setting marker
  * @returns {Undefined}
  */
  _setQuery(query, lnglat) {
    this.setState({
      queryResult: query,
      position: lnglat
    });
  }

  /**
   * Set map position, defaults zoom to lowest level
   * @param {Array} position - position of place that was queried for setting marker
   * @returns {Undefined}
   */
  _setMapPosition(position) {
    this.setState({
      position: position,
      zoom: 15
    });
  }

  /**
  * GeoCode whatever we put into the search input, trigger map re-render by setting state...
  * @param {String} address - Address to geocode
  * @returns {Function} g.geocode - function that actually converts our address, and triggers
  * callback to set map position
  */
  _getMapPosition(address) {
    const g = new google.maps.Geocoder();
    const params = {
      address
    };

    return g.geocode(params, (results, status) => {
      const location = results[0].geometry.location;
      // note it's usually lng/lat but leaflet does it different
      let position = [location.lat(), location.lng()];
      this._setMapPosition(position);
    });
  }

  /**
   * Handle search event in header
   * @TODO Better handled as a "server-side" action?
   * @param {e} event - React synthetic event object
   * @returns {Undefined}
   */
  _handleSearch(e) {
    e.preventDefault();
    let address = $(e.target).find('input[type=text]').val();
    return this._getMapPosition(address);
  }

  /**
   * Handle about link click in header
   * @param {e} event - React synthetic event object
   * @returns {Undefined}
   */
  _handleAboutClick(e) {
    e.preventDefault();
    this.setState({
      isAboutOpen: !this.state.isAboutOpen
    });
  }

  /**
   * Handle tour link click in header
   * @param {e} event - React synthetic event object
   * @returns {Undefined}
   */
  _handleTourClick(e) {
    e.preventDefault();
    this.setState({
      isTourActive: true
    });
  }

  /**
   * Handle welcome modal 'continue' button
   * Hides welcome modal and kicks off tour
   * @param {e} event - React synthetic event object
   * @returns {Undefined}
   */
  _handleContinue(e) {
    e.preventDefault();
    $.cookie('welcomed', true);
    this._handleTourClick();
    this._handleClose();
  }

  /**
   * Handle query of leaflet layers from right click
   * @param {Array} lnglat - Coords to query
   * @returns {Function} this._setQuery - set query in Query Component UI
   */
  _handleQuery(lnglat) {
    // look through each layer in order and see if the clicked point,
    // e.latlng, overlaps with one of the shapes in it.
    let i = 0;
    const query = {
      ap: 'No average precipitation data yet.',
      ep: 'No storm frequency data yet.',
      shouldDisplay: true
    };

    // @TODO: forEach w/ Object.keys should suffice?
    _.each(_.keys(application.gjLayers), (layer) => {
      let match = leafletPip.pointInLayer(lnglat, application.gjLayers[layer], false)[0];
      if (match && layer === 'annual-precipitation') {
        query.ap = `${match.feature.properties.DN}%↑ Annual Precipitation`;
      } else if (match && layer === 'storm-frequency') {
        query.ep = `${match.feature.properties.DN}%↑ Storm Frequency`;
      } else {
        return this._setQuery(query, lnglat);
      }
    });

    return this._setQuery(query, lnglat);
  }

  /**
   * Handle layer switch events in legend
   * @param {e} event - React synthetic event object
   * @returns {Undefined}
   */
  _handleSwitch(e) {
    e.stopPropagation();

    const name = $(e.nativeEvent.target).data('type');
    let map = application.map;
    let { showAnnualPrecipitation, showStormFrequency, showFloodZones } = this.state.layers;
    let layers = {
      showAnnualPrecipitation,
      showStormFrequency,
      showFloodZones
    }
    if (name === 'annual-precipitation') {
      layers.showAnnualPrecipitation = !layers.showAnnualPrecipitation;
    } else if (name === 'storm-frequency') {
      layers.showStormFrequency = !layers.showStormFrequency;
    } else if (name === 'flood-zones') {
      layers.showFloodZones = !layers.showFloodZones;
    }

    this.setState({
      layers: layers
    });
  }

  /**
   * Handle close event for both about and welcome modal
   * @param {e} event - React synthetic event object
   * @returns {Undefined}
   */
  _handleClose(e) {
    e.preventDefault();
    this.setState({
      isWelcomeOpen: false,
      isAboutOpen: false
    })
  }

  /**
   * React Lifecycle Event, called after component is mounted
   * @instance
   */
  componentDidMount() {
    this._setEvents();
  }

  /**
   * React Lifecycle Event, renders component to DOM
   * @returns {Object} React Component
   */
  render() {
    return (
      <div>
        <Header isMobileNavActive={this.state.isMobileNavActive} onSearch={this._handleSearch} onQuery={this._handleQuery} onAboutClick={this._handleAboutClick} onTourClick={this._handleTourClick} onMobileToggle={this._handleMobileToggle} />
        <Map center={this.state.position} zoom={this.state.zoom} layers={this.state.layers} onQuery={this._handleQuery} />
        <Legend className="col-md-3" queryResult={this.state.queryResult} layers={this.state.layers} />
        <Share className="col-md-2" />
        {!$.cookie('welcomed') && <Welcome isWelcomeOpen={this.state.isWelcomeOpen} onClose={this._handleClose} onContinue={this._handleContinue} />}
        <About isAboutOpen={this.state.isAboutOpen && !this.state.isTourActive} onClose={this._handleClose} />
        {this.state.isTourActive && <Tour onComplete={this._handleComplete} onStart={this._handleTourStart} />}
      </div>
    );
  }
}

/**
 * Validation for context
 * @param {Func} handleSwitch - Handler for LayerSwitch toggle clicks
 */
Base.childContextTypes = {
  _handleSwitch: React.PropTypes.func
}


module.exports = Base;
