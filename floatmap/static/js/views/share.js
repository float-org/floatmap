import $ from 'jquery';

Backbone.Layout.configure({
  manage: true
});

let ShareView = application.ShareView = Backbone.View.extend({
  template: "#shareTemplate",
  events: {
    ["click #shareContent a"](e) {
      e.preventDefault();
      return this.openPopup(e.target.href);
    }
  },

  openPopup(url) {
    return window.open( url, "window", "height = 500, width = 559, resizable = 0" );
  }
});

export default ShareView;
