ShareView = app.ShareView = Backbone.View.extend
  template: "#shareTemplate"
  events:
    "click #shareContent a": (e) ->
      e.preventDefault()
      this.openPopup(e.target.href)

  openPopup: (url) ->
    window.open( url, "window", "height = 500, width = 559, resizable = 0" )

module.exports = ShareView
