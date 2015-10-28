/*
 * /lib/response_handler.js
 */
  var fs = require('fs');
  // Constructor
  var response_handler = function(res) {
    this.res = res;
    this.cookie = undefined;
  };

  // properties and methods
  response_handler.prototype = {
    //store the node response object so we can operate on it
    res: {},

    serverError : function(code, content) {
      var self = this;
      self.res.writeHead(code, {'Content-Type': 'text/plain'});
      self.res.end(content);
    },

    renderHtml : function(content) {
      var self = this;
      console.log("rendering HTML... Cookie is...");
      console.log(self.cookie);
      if (self.cookie) {
        self.res.writeHead(200, {
          'Set-Cookie': self.cookie,
          'Content-Type': 'text/html'
        });
      } else {
        self.res.writeHead(200, {'Content-Type': 'text/html'});
      }
      self.res.end(content, 'utf-8');
    },

    renderWebroot : function(requestedUrl) {
      var self = this;
      // try and match a file in our webroot directory
      fs.readFile('./app/webroot' + requestedUrl.href, function(error, content) {
        if (error) {
          self.serverError(404, '404 Bad Request');
        } else {
          var extension = (requestedUrl.pathname.split('.').pop());
          self.res.writeHead(200, self.getHeadersByFileExtension(extension));
          self.res.end(content, 'utf-8');
        }
      });
    },

    setCookie: function(key, val) {
      var self = this;
      console.log("Setting the cookie");
      self.cookie = key + '=' + val;
      console.log(self.cookie);
    },

    clearCookie: function(key) {
      var self = this;
      self.res.writeHead(200, {
        'Set-Cookie': key + '=' + '',
        'Content-Type': 'text/plain'
      });
    },

    redirectTo: function(url) {
      var self = this;
      if (self.cookie) {
        self.res.writeHead(302, {
          'Location': url,   
          'Set-Cookie': self.cookie,
          'Content-Type': 'text/html'
        });
      } else {
        self.res.writeHead(302, {'Location': url});
      }
      self.res.end();
    },

    getHeadersByFileExtension : function(extension) {
      var self = this;
      var headers = {};

      switch (extension) {
        case 'css':
          headers['Content-Type'] = 'text/css';
          break;
        case 'js':
          headers['Content-Type'] = 'application/javascript';
          break;
        case 'ico':
          headers['Content-Type'] = 'image/x-icon';
        default:
          headers['Content-Type'] = 'text/plain';
      }
      return headers;
    },

  };

  // node.js module export
  module.exports = response_handler;