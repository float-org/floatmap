import $ from 'jquery';
import 'jquery.cookie';
import { getColor } from '../utils';
import _ from 'underscore';
import L from '../vendor/leaflet';
import QueryView from './query';

Backbone.Layout.configure({
  manage: true
});

let LegendView = application.LegendView = Backbone.View.extend({
  template: "#legendTemplate",

  events: {
    ["click #legend-toggle"](e) {
      if ($('.legend-wrapper').hasClass('active')) { // i.e. if panel is open
        $('.legend-wrapper').addClass('invisible');
        return setTimeout(() => $('.legend-wrapper, #legend-toggle, #legend').removeClass('active')
        , 1);
      } else {
        $('.legend-wrapper, #legend-toggle, #legend').addClass('active');
        return setTimeout(() => $('.legend-wrapper').removeClass('invisible')
        , 150);
      }
    },


    ["click .switch-container"](e) {
      e.stopPropagation();
      let { map } = application;
      let name = $(e.currentTarget).find('.ios-switch').data('layer');
      let layer = application.layers[name];
      let current_ap = application.layers['apLayer'];
      let current_ep = application.layers['epLayer'];

      // This is super gross and only has to be this complicated because geoJson layers
      // do not seem to respect zIndex, even though you can set a zIndex on them when
      // adding them to the map.  Grrrrr.


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

  //Query popup box as a subview
  views: {
    '#query': new QueryView()
  },

  afterRender() {
    let self = this;
    let apGrades = _.range(0,13,1);
    let labels = [];

    if (!$("button.navbar-toggle").is(":visible")) {
      $('.legend-wrapper, #legend-toggle, #legend').addClass('active');
      let callback = () => $('.legend-wrapper').removeClass('invisible');
      setTimeout(callback, 150);
    }

    let switches = document.querySelectorAll('input[type="checkbox"].ios-switch');

    for (let j = 0; j < switches.length; j++) {
      let i = switches[j];
      let div = document.createElement('div');
      div.className = 'switch';
      i.parentNode.insertBefore(div, i.nextSibling);
    }

    // ToDo: Worth transferring this HTML to the template at some point?
    self.$el.find(".apRange").append("<div class='ap-values'></div>");
    $(apGrades).each(function(index) {
      let apValue = $(`<div><i style="background:${getColor("ap", this)}"></i></div>`);
      if (index % 4 === 0) {
        let textNode = `<span>+${this}%</span>`;
        apValue.append(textNode);
      }
      return self.$el.find(".ap-values").append(apValue);
    });
    self.$el.find(".apRange").append("<div class='ap-arrow'></div>");
    self.$el.find(".apRange").append("<span class='ap-text'>Increasing Average Precipitation</span>");
    // TODO: Why do I have to do this at all?
    self.$el.appendTo(application.layout.$el.find('#legend'));

    $('#legend').on("click", function(e) {
      if ($('#legend').hasClass('active')) {
        return;
      } else {
        $('.legend-wrapper, #legend-toggle, #legend').addClass('active');
        let callback =  () => $('.legend-wrapper').removeClass('invisible');
        return setTimeout(callback, 150);
      }
    }
    );

    if ($.cookie('welcomed')) {
      $('#floods-switch').prop('checked',true);
      $('#apLayer-switch').prop('checked',true);
      $('#epLayer-switch').prop('checked',true);
    }

    return $("[data-toggle=tooltip]").tooltip({ placement: 'left'});
  }
});

export default LegendView;
