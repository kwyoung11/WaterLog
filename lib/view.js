/*
 * /lib/view.js
 */
var fs = require('fs');
var Mustache = require('mustache');
var util = require('./util');
var view = function() {};

view.prototype = {

	renderView : function(name, data, callback) {
      var self = this;

      if (typeof callback !== 'function') throw ViewCallbackException;

        self.getView(name, 'html', function(content) {
          // use the Mustache templating engine to render the data passed in to HTML
          var template = Mustache.to_html(content, data); 
          // console.log(template);

          self.getLayout({}, function(content) {
            content = self.setLayoutContent(content, template, data);
            // console.log(content);
            callback(content);
       });
    });
  }, 

  // 
  getView : function(name, format, callback) {
    var self = this;

    if (!name) {
      return '';
    }

    var format = format ? format : 'html';
    var path = './app/views/' + name + '.' + format;

    // callback handling
    var callback = (typeof callback === 'function') ? callback : function() {};

  	fs.readFile(path, 'utf-8', function(error, content) {
  	  if (error) {
  	    throw new Error('ViewNotFoundException');
  	  } else {
  	    callback(content);
  	  }
  	});
  },

  getLayout : function(options, callback) {
    var self = this;
    var options = options ? options : {
      'name' : 'default',
      'format' : 'html'
    };
    var name   = options.name ? options.name : 'default';
    var format = options.format ? options.format : 'html';

		// callback handling
		var callback = (typeof callback === 'function') ? callback : function() {};
		
		var path = './app/views/layouts/' + name + '.' + format;
		
		fs.readFile(path, 'utf-8', function(error, content) {
		  if (error) {
		    throw new Error('LayoutNotFoundException');
		  } else {
		    callback(content);
		  }
		});
  },

  setLayoutContent : function(layout, content, data) {
    var self = this;
    var layout = layout ? layout : '';
    var context = {
      'content_for_layout' : content ? content : ''
    };
    util.merge(context, data)
    return Mustache.to_html(layout, context);
  },

};
module.exports = new view();