import $ from 'jquery';
import _ from 'underscore';
import QueryModel from '../models/query';
import leafletPip from '../vendor/leaflet-pip';

Backbone.Layout.configure({
  manage: true
});

// View for the data that appears in the collapsable element above the legend.
let QueryView = application.QueryView = Backbone.View.extend({
  template: "#queryTemplate",

  initialize() {
    this.model = new QueryModel();
    return this.listenTo(this.model, "change", this.render);
  },

  serialize() {
    return { query: this.model.attributes };
  },

  handleQuery(lnglat) {
    // look through each layer in order and see if the clicked point,
    // e.latlng, overlaps with one of the shapes in it.
    let i = 0;
    while (i < _.size(application.gjLayers)) {
      let match = leafletPip.pointInLayer(lnglat, application.gjLayers[Object.keys(application.gjLayers)[i]], false);
      // if there's overlap, add some content to the popup: the layer name
      // and a table of attributes

      if (Object.keys(application.gjLayers)[i] === 'apLayer') {
        if (match.length) {
          this.model.set({'ap': match[0].feature.properties.DN + '%↑ Annual Precipitation'});
        } else {
          this.model.set({'ap': 'No average precipitation data yet.'});
        }
      }
      if (Object.keys(application.gjLayers)[i] === 'epLayer') {
        if (match.length) {
          this.model.set({'ep': match[0].feature.properties.DN + '%↑ Storm Frequency'});
        } else {
          this.model.set({'ep': 'No storm frequency data yet.'});
        }
      }
      i++;
    }
    return;
  },

  afterRender() {
    if (JSON.stringify(this.model.defaults) !== JSON.stringify(this.model.attributes)) {
      if (!$('.legend-wrapper').hasClass('active')) {
        $('#legend-toggle').trigger('click');
      }
      return setTimeout(function() {
        if (!$('#query').hasClass('active')) {
          return $('#query').addClass('active');
        }
      }
      , 200);
    }
  }
});

export default QueryView;
