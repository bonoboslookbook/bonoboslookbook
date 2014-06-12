describe('App', function() {
  beforeEach(function(){
    response = {
      pagination: {},
      data: [
        {
          images: {
            low_resolution: {url: 'img/low.jpg'},
            standard_resolution: {url: 'img/full.jpg'},
            thumbnail: {url: 'img/thumb1.jpg'}
          }
        },
        {
          images: {
            low_resolution: {url: 'img/foo.jpg'},
            standard_resolution: {url: 'img/1.jpg'},
            thumbnail: {url: 'img/thumb2.jpg'}
          }
        }
      ]
    };
  });

  describe('start', function() {
    it('sends a request to the Instagram API', function() {
      spyOn($, "ajax");

      App.start();

      expect($.ajax).toHaveBeenCalledWith({
        url: "https://api.instagram.com/v1/users/8194723/media/recent/?client_id=fad846f425dd4dafba870b952df76469",
        dataType: "jsonp",
        success: App.init
      });
    });
  });

  describe('init', function() {
    beforeEach(function(){
      affix('div#most-recent-image');
    });

    it('adds the most recent image to the dom as a full size image', function() {
      App.init(response);

      image = $('#most-recent-image img');
      expect(image.length).toEqual(1);
      expect(image).toBeVisible();
      expect(image.attr('src')).toEqual('img/full.jpg');
    });

    it('calls addThumbnails()', function() {
      spyOn(App, 'addThumbnails');

      App.init(response)

      expect(App.addThumbnails).toHaveBeenCalledWith(response.data);
    });
  });

  describe('addThumbnails', function() {
    beforeEach(function() {
      affix('div#images');
    });

    it('adds a thumbnail for every set of images in media', function() {
      App.addThumbnails(response.data);

      thumbnails = $('#images img')

      expect(thumbnails.length).toEqual(2)
      expect(thumbnails.first().attr('src')).toEqual('img/thumb1.jpg')
      expect(thumbnails.last().attr('src')).toEqual('img/thumb2.jpg')
    });

    it('hides the ajax-loader if it is visible', function() {
      affix('div#ajax-loader');

      App.addThumbnails(response.data);

      expect($('#ajax-loader').length).not.toBeVisible();
    });
  });
});
