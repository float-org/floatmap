import $ from 'jquery';
import 'bootstrap';
import DataTourView from './tour';

Backbone.Layout.configure({
  manage: true
});

// Display welcome modal - should only appear if a cookie hasn't been set in the browser
let WelcomeView = application.WelcomeView = Backbone.View.extend({

  template: "#welcomeTemplate",

  events: {
    ['click #startDataTour'](e) {
      e.preventDefault();
      let dataTour = new DataTourView();
      let dataView = this.insertView('#dataTour', dataTour);
      return dataView.render();
    },

    ['shown.bs.modal #welcomeModal'](e) {
      return this.reposition();
    },

    ['click #closeModal'](e) {
      application.map.addLayer(floods, 1);
      $('#floods-switch').prop('checked',true);
      application.map.addLayer(ap, 2);
      $('#apLayer-switch').prop('checked',true);
      application.map.addLayer(ep, 3);
      return $('#epLayer-switch').prop('checked',true);
    }
  },

  initialize(e) {
    let self = this;
    return $(window).on('resize', e => self.reposition());
  },

  // Kick off the modal once the view has been created
  afterRender() {
    console.log('laksjg');
    return $('#welcomeModal').modal({
      backdrop: 'static',
      keyboard: true
    }, 'show');
  },

  // Keeps the modal centered (more or less)
  reposition() {
    let modal = this.$el;
    let dialog = modal.find('.modal-dialog');
    modal.css('display', 'block');
    // Dividing by two centers the modal exactly, but dividing by three
    // or four works better for larger screens.
    return dialog.css("margin-top", Math.max(0, ($(window).height() - dialog.height()) / 2));
  }
});

export default WelcomeView;
