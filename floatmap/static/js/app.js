$ = require('jquery');
window.jQuery = $;
window.$ = $;
require('jquery.cookie');
window.Shepherd = require('tether-shepherd');
Backbone = require('backbone');
require('backbone.layoutmanager');
window.Backbone = Backbone;

window._ = require('underscore');
function requireAll(r) { r.keys().forEach(r); }
requireAll(require.context('./vendor/', true, /\.js$/));

$(document).ready(function() {
  window.app = {};

  defaultIcon = L.icon({
    iconUrl: 'static/img/marker-icon.png',
    shadowUrl: 'static/img/marker-shadow.png'
  });

  Backbone.Layout.configure({
    manage: true
  });

  leafletPip = require('./vendor/leaflet-pip');
  Rainbow = require('rainbowvis.js');
  QueryModel = require('./compiled/queryModel');
  utils = require('./compiled/utils');
  HeaderView = require('./compiled/header');
  DataTourView = require('./compiled/tour');
  WelcomeView = require('./compiled/welcome');
  MapView = require('./compiled/map');
  QueryView = require('./compiled/query');
  LegendView = require('./compiled/legend');
  ShareView = require('./compiled/share');
  FloatLayout = require('./compiled/base');

  layout = app.layout = new FloatLayout()
  layout.$el.appendTo('#main')

  layout.render()
});
