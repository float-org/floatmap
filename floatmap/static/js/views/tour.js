import React from 'react';
import $ from 'jquery';
import Shepherd from 'tether-shepherd';

/**
 * Tour component - mostly a way to invoke Shepherd outside of component lifecycle (i.e. after render)
 * @class
 */
class Tour extends React.Component {

  /**
   * React Component Lifecycle - Called by React when the component is about to render
   * @instance
   */
  componentWillMount() {
    this.props.onStart();
  }

  /**
   * React Component Lifecycle - Called by React when the component will be removed from the DOM
   * @instance
   */
  componentWillUnmount() {
    application.tour.complete();
    application.tour = undefined;
  }

  /**
   * React Component Lifecycle - Called by React when the component has rendered
   * @instance
   */
  componentDidMount() {
    application.tour = new Shepherd.Tour({
      defaults: {
        classes: 'shepherd-theme-arrows',
        scrollTo: true
      }
    });

    application.tour.defaultIcon = L.icon({
      iconUrl: 'static/img/marker-icon.png',
      shadowUrl: 'static/img/marker-shadow.png'
    });

    L.Icon.Default.imagePath = "../static/img";

    $('.flood-zones input').prop('checked',false);
    $('.annual-precipitation input').prop('checked',false);
    $('.storm-frequency input').prop('checked',false);

    // @TODO: Probably should utilize promises for better async
    setTimeout(() => {
      $('.annual-precipitation .switch').trigger('click');
    }, 1);

    // Avg Precip explanation step
    application.tour.addStep('ap-step', {
      title: 'Annual Precipitation',
      text: 'The Annual Precipitation layer shows how total rain and snowfall each year is projected to grow by the 2040-2070 period. More annual precipitation means more water going into rivers, lakes and snowbanks, a key risk factor for bigger floods. These projections come from the National Oceanic and Atmospheric Administration (2014).',
      attachTo: '.component-layer-switch.annual-precipitation top',
      buttons: [{
        text: 'Next',
        action() {
          $('.storm-frequency .switch').trigger('click');
          return application.tour.next();
        }
      }
      ]
    });

    // Ext Precip explanation step
    application.tour.addStep('ep-step', {
      title: 'Storm Frequency',
      text: 'The Storm Frequency layer shows how days with heavy rain or snow (over 1 inch per day) are projected to come more often by the 2040-2070 period. More storm frequency means more rapid surges of water into rivers and lakes, a key risk factor for more frequent flooding. These projections also come from the National Oceanic and Atmospheric Administration (2014).',
      attachTo: '.component-layer-switch.storm-frequency top',
      buttons: [{
        text: 'Next',
        action() {
          $('.flood-zones .switch').trigger('click');
          return application.tour.next();
        }
      }
      ]
    });

    // Floods explanation step
    application.tour.addStep('flood-step', {
      title: 'Flood Zones',
      text: 'The Flood Zones show the areas that already are at major risk for flooding, based on where floods have historically reached. If floods become larger and more frequent, many neighboring areas to these historical flood zones are likely to start experience flooding. This information comes from the Federal Emergency Management Administration (2014).',
      attachTo: '.component-layer-switch.flood-zones top',
      buttons: [{
        text: 'Next',
        action: application.tour.next
      }
      ]
    });

    // Display search step
    application.tour.addStep('search-step', {
      title: 'Search',
      text: 'Search for a specific address, city or landmark. Try using the search bar now to find a location you care about in the Midwest.',
      attachTo: '.component-search-form bottom',
      buttons: [{
        text: 'Next',
        action() {
          return setTimeout(() => application.tour.next()
          , 450);
        }
      }
      ]
    });

    // Display query step
    // TODO: Not totally in love w/ the animation here - play around with it some more.
    application.tour.addStep('query-step', {
      title: 'Inspect',
      text: '<p>Right click anywhere on the map to inspect the numbers for that specific place.</p><br /><p>Take a tour of some communities at high risk for worsened flooding.</p>',
      attachTo: '.component-query left',
      buttons: [{
        text: 'Take a Tour',
        action() {
          let latlng = [44.519, -88.019];
          application.map.setView(latlng, 13);
          if (application.map.marker) {
            application.map.removeLayer(application.map.marker);
          }
          let marker = application.map.marker = L.marker(latlng, { icon: application.tour.defaultIcon }).addTo(application.map);
          return application.tour.next();
        }
      }
      , {
        text: 'Stop Tour',
        action: this.props.onComplete
      }
      ]
    });

    // The following steps show particular regions on the map
    application.tour.addStep('map-lambeau', {
      title: 'Green Bay, WI',
      text: 'The home of the Packers has a large neighborhood of paper plants and homes at high risk of worsened flooding, with storm days increasing nearly 40% and annual precipitation rising 10% in the next few decades.',
      attachTo: '.leaflet-marker-icon left',
      buttons: [{
        text: 'Continue',
        action() {
          let latlng = [43.1397, -89.3375];
          application.map.setView(latlng, 13);
          if (application.map.marker) {
            application.map.removeLayer(application.map.marker);
          }
          let marker = application.map.marker = L.marker(latlng, { icon: application.tour.defaultIcon }).addTo(application.map);
          return application.tour.next();
        }
      }
      , {
        text: 'Stop Tour',
        action: this.props.onComplete
      }
      ]
    });

    application.tour.addStep('map-dane', {
      title: 'Madison, WI Airport',
      text: 'Airports are often built on flat areas near rivers, placing them at serious risk of flooding, like Madison’s main airport, serving 1.6 million passengers per year.',
      attachTo: '.leaflet-marker-icon left',
      buttons: [{
        text: 'Continue',
        action() {
          let latlng = [42.732072157891224, -84.50576305389404];
          application.map.setView([42.73591782230738, -84.48997020721437], 13);
          if (application.map.marker) {
            application.map.removeLayer(application.map.marker);
          }
          let marker = application.map.marker = L.marker(latlng, { icon: application.tour.defaultIcon }).addTo(application.map);
          return application.tour.next();
        }
      }
      , {
        text: 'Stop Tour',
        action: this.props.onComplete
      }
      ]
    });

    application.tour.addStep('map-lansing', {
      title: 'Lansing, MI',
      text: 'A large stretch of downtown businesses and homes are at risk of worsened flooding, as well as part of the Michigan State campus.',
      attachTo: '.leaflet-marker-icon left',
      buttons: [{
        text: 'Continue',
        action() {
          let latlng = [41.726, -90.310];
          application.map.setView([41.7348457153312, -90.310], 13);
          if (application.map.marker) {
            application.map.removeLayer(application.map.marker);
          }
          let marker = application.map.marker = L.marker(latlng, { icon: application.tour.defaultIcon }).addTo(application.map);

          return application.tour.next();
        }
      }
      , {
        text: 'Stop Tour',
        action: this.props.onComplete
      }
      ]
    });

    application.tour.addStep('map-quadcities', {
      title: 'Quad Cities Nuclear Generating Station',
      text: 'Power plants, including nuclear plants like the one here, are frequently built on riverbanks to use water for cooling. Larger, more frequent future floods could place these power plants and their communities at risk.',
      attachTo: '.leaflet-marker-icon bottom',
      buttons: [{
        text: 'Stop Tour',
        action: this.props.onComplete
      }
      ]
    });

    return application.tour.start();
  }

  /**
   * React Component Lifecycle - render
   * @instance
   */
  render() {
    return (
      <div className="component-tour"></div>
    )
  }
};

/**
 * Prop Validation
 * @param {Function} onComplete - callback to fire when tour is done
 * @param {Function} onStart - callback to fire when tour is starting
 * @TODO Default props...?
 */
Tour.PropTypes = {
  onComplete: React.PropTypes.func,
  onStart: React.PropTypes.func
}

module.exports = Tour;
