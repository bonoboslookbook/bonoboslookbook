(function() {
  window.App = {
    template: "<a data-lightbox='lookboox' data-title='{{caption}}' href='{{lightboxUrl}}' target='_blank'> <img src='{{imageUrl}}'> </a>",
    clientId: "fad846f425dd4dafba870b952df76469",
    init: function(response) {
      var imageUrl, media, mostRecentImage, _ref;
      $.Mustache.add('image-template', App.template);
      App.nextUrl = response.pagination.next_url;
      media = response.data;
      mostRecentImage = media.shift().images;
      imageUrl = mostRecentImage.standard_resolution.url;
      $("#most-recent-image").mustache('image-template', {
        lightboxUrl: imageUrl,
        imageUrl: imageUrl,
        caption: (_ref = media.caption) != null ? _ref.text : void 0
      });
      App.addThumbnails(media);
      return $(window).scroll(App.infiniteScroll);
    },
    addThumbnails: function(media) {
      var data, templateData, _i, _len, _ref;
      for (_i = 0, _len = media.length; _i < _len; _i++) {
        data = media[_i];
        templateData = {
          lightboxUrl: data.images.standard_resolution.url,
          imageUrl: data.images.thumbnail.url,
          caption: (_ref = data.caption) != null ? _ref.text : void 0
        };
        $("#images").mustache('image-template', templateData);
      }
      $('#ajax-loader').hide();
      return App.scrollInProcess = false;
    },
    infiniteScroll: function(url) {
      if (!App.nextUrl) {
        return;
      }
      if (($(window).scrollTop() >= $(document).height() - $(window).height() - 60) && !App.scrollInProcess) {
        App.scrollInProcess = true;
        $('#ajax-loader').show();
        return $.ajax({
          url: App.nextUrl,
          dataType: "jsonp",
          success: function(response) {
            App.nextUrl = response.pagination.next_url;
            return App.addThumbnails(response.data);
          }
        });
      }
    },
    start: function() {
      return $.ajax({
        url: "https://api.instagram.com/v1/users/8194723/media/recent/?client_id=" + App.clientId,
        dataType: "jsonp",
        success: App.init
      });
    }
  };

}).call(this);
