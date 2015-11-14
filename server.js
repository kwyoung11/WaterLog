//include our modules
var http  = require('http');
var https  = require('https');
var url   = require('url');
var os = require('os');
var fs = require('fs');

GLOBAL.flash = {};

var connection = {};
if (process.env.NODE_ENV == undefined || process.env.NODE_ENV == 'development') {
  process.env.NODE_ENV = 'development';  
  connection['port'] = 3000;
  connection['domain'] = '127.0.0.1';
} else {
  process.env.NODE_ENV = 'production';
  connection['port'] = process.env.PORT;
  connection['domain'] = '0.0.0.0';
}

//require custom dispatcher
var dispatcher = require('./lib/dispatcher.js');

console.log('Starting server @ http://127.0.0.1:' + connection['port'] + '/');

http.createServer(function (req, res) {

  // wrap calls in a try catch
  // or the node js server will crash upon any code errors
  try {
    
    // pipe some details to the node console
    console.log('Incoming Request from: ' +
                 req.connection.remoteAddress +
                ' for href: ' + url.parse(req.url).href
    );

	
  // dispatch our request
  dispatcher.dispatch(req, res);

  } catch (err) {
      //handle errors gracefully
      console.log(err);
      res.writeHead(500);
      res.end('Internal Server Error');
    }
  }).listen(3000, '127.0.0.1', function() {
    //runs when our server is created
    console.log('Server running at http://127.0.0.1:' + connection['port'] + '/');
  });
