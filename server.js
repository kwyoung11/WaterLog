//include our modules
var sys   = require('sys');
var http  = require('http');
var url   = require('url');
var os = require('os');

//require custom dispatcher
var dispatcher = require('./lib/dispatcher.js');
var connection = {};
if (process.env.NODE_ENV == "undefined") {
  process.env.NODE_ENV = 'development';  
  connection['port'] = 3000;
  connection['domain'] = '127.0.0.1';
} else {
  process.env.NODE_ENV = 'development';  
  connection['port'] = 8080;
  connection['domain'] = '127.0.0.1';
}
console.log('Starting server @ http://127.0.0.1:1337/');
var hostname = os.hostname();
console.log('Hostname:' + hostname);
console.log();
http.createServer(function (req, res) {
  // wrap calls in a try catch
  // or the node js server will crash upon any code errors
  try {
    // pipe some details to the node console
    console.log('Incoming Request from: ' +
                 req.connection.remoteAddress +
                ' for href: ' + url.parse(req.url).href
    );


  //dispatch our request
  dispatcher.dispatch(req, res);

  } catch (err) {
      //handle errors gracefully
      sys.puts(err);
      res.writeHead(500);
      res.end('Internal Server Error');
    }
  }).listen(connection['port'], connection['domain'], function() {
    //runs when our server is created
    console.log('Server running at http://127.0.0.1:1337/');
  });