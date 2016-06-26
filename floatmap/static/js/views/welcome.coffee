# Display welcome modal - should only appear if a cookie hasn't been set in the browser
WelcomeView = app.WelcomeView = Backbone.View.extend

  template: "#welcomeTemplate"

  events:
    'click #startDataTour': (e) ->
      e.preventDefault()
      dataTour = new DataTourView()
      dataView = this.insertView('#dataTour', dataTour)
      dataView.render()

    'shown.bs.modal #welcomeModal': (e) ->
      this.reposition()

    'click #closeModal': (e) ->
      app.map.addLayer floods, 1
      $('#floods-switch').prop('checked',true)
      app.map.addLayer ap, 2
      $('#apLayer-switch').prop('checked',true)
      app.map.addLayer ep, 3
      $('#epLayer-switch').prop('checked',true)

  initialize: (e) ->
    self = this
    $(window).on 'resize', (e) ->
      self.reposition()

  # Kick off the modal once the view has been created
  afterRender: () ->
    console.log 'laksjg'
    $('#welcomeModal').modal({
      backdrop: 'static'
      keyboard: true
    }, 'show')

  # Keeps the modal centered (more or less)
  reposition: () ->
    modal = this.$el
    dialog = modal.find('.modal-dialog')
    modal.css('display', 'block')
    # Dividing by two centers the modal exactly, but dividing by three
    # or four works better for larger screens.
    dialog.css("margin-top", Math.max(0, ($(window).height() - dialog.height()) / 2))

module.exports = WelcomeView
