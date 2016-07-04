import $ from 'jquery';
import jQuery from 'jquery';
import L from './vendor/leaflet';
import _ from 'underscore';
import 'jquery.cookie';
import 'bootstrap';
import 'backbone.layoutmanager';
import FloatLayout from './layouts/float';

Backbone.Layout.configure({
  manage: true
});

$(document).ready(() => {

  const defaultIcon = L.icon({
    iconUrl: 'static/img/marker-icon.png',
    shadowUrl: 'static/img/marker-shadow.png'
  });

  Backbone.Layout.configure({
    manage: true
  });

  application.layout = new FloatLayout()
  application.layout.$el.appendTo('#main')

  application.layout.render()
});
