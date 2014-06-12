window.App =

  template: "<a data-lightbox='lookboox' data-title='{{caption}}' href='{{lightboxUrl}}' target='_blank'> <img src='{{imageUrl}}'> </a>"

  clientId: "fad846f425dd4dafba870b952df76469"

  init: (response) ->
    #$.Mustache.addFromDom()#('image-template', App.template)
    $.Mustache.add('image-template', App.template)
    App.nextUrl = response.pagination.next_url
    media = response.data
    mostRecentImage = media.shift().images
    imageUrl = mostRecentImage.standard_resolution.url
    $("#most-recent-image").mustache 'image-template', {lightboxUrl: imageUrl, imageUrl: imageUrl, caption: media.caption?.text}
    App.addThumbnails(media)
    $(window).scroll(App.infiniteScroll)

  addThumbnails: (media) ->
    for data in media
      templateData = lightboxUrl: data.images.standard_resolution.url, imageUrl: data.images.thumbnail.url, caption: data.caption?.text
      $("#images").mustache 'image-template', templateData
    $('#ajax-loader').hide()
    App.scrollInProcess = false

  infiniteScroll: (url) ->
    return unless App.nextUrl
    if ($(window).scrollTop() >= $(document).height() - $(window).height() - 60) && !App.scrollInProcess
      App.scrollInProcess = true
      $('#ajax-loader').show()
      $.ajax
        url: App.nextUrl
        dataType: "jsonp"
        success: (response) ->
          App.nextUrl = response.pagination.next_url
          App.addThumbnails(response.data)

  start: ->
    $.ajax
      url: "https://api.instagram.com/v1/users/8194723/media/recent/?client_id=" + App.clientId
      dataType: "jsonp"
      success: App.init
