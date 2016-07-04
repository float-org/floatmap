import $ from 'jquery';
import L from '../vendor/leaflet';
import DataTourView from './tour';

Backbone.Layout.configure({
  manage: true
});

// Header View handles behavior for the header, including search and nav.
let HeaderView = application.HeaderView = Backbone.View.extend({

  // As defined in map.html
  template: "#headerTemplate",

  // GeoCode whatever we put into the search input, update the location of the map by calling MapView.setAddress
  // from our layout
  getAddress(address) {
    let g = new google.maps.Geocoder();
    return g.geocode({ address }, function(results, status) {
      let latLng = [ results[0].geometry.location.lat(), results[0].geometry.location.lng() ];
      application.layout.views['map'].setAddress(latLng, 15);
      if (application.map.marker) {
        application.map.removeLayer(application.map.marker);
      }
      let marker = application.map.marker = L.marker(latLng, { icon: defaultIcon }).addTo(application.map);
      if ($("button.navbar-toggle").is(":visible")) {
         return $("button.navbar-toggle").trigger("click");
       }
    });
  },

  events: {
    ["submit #search"](e) {
      e.preventDefault();
      let address = $(e.target).find('.search-input').val();
      return this.getAddress(address);
    },

    ["submit #searchMobile"](e) {
      e.preventDefault();
      let address = $(e.target).find('.search-input').val();
      return this.getAddress(address);
    },

    // TODO: Currently, we are blessed with Bootstrap Modal working properly outside of Backbone.  I should probably
    // make an event that creates an AboutModalView at some point just so it follows our convention.

    // Start the tour from the nav
    ["click #tourLink"](e) {
      e.preventDefault();
      let dataTour = new DataTourView();
      let dataView = this.insertView('#dataTour', dataTour);
      return dataView.render();
    }
  }
});

export default HeaderView;
