import $ from 'jquery';
import 'backbone.layoutmanager';

import {
  WelcomeView,
  HeaderView,
  MapView,
  LegendView,
  ShareView
} from '../views';


let FloatLayout = Backbone.Layout.extend({
  template: "#floatLayout",
  initialize() {
    // TODO: Separate tour from welcomeview so we don't have to instantiate it at all if the cookie exists

    let welcome = new WelcomeView();
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

module.exports = FloatLayout;
