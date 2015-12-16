//include our modules
var http  = require('http');
var https  = require('https');
var url   = require('url');
var os = require('os');
var fs = require('fs');
var config = require('./config/config.js');

GLOBAL.flash = {};

var connection = {};
if (process.env.NODE_ENV == undefined || process.env.NODE_ENV == 'development') {
  process.env.NODE_ENV = 'development';
  config.hostname = '127.0.0.1';
  connection['port'] = 3000;
  connection['domain'] = '127.0.0.1';
} else {
  process.env.NODE_ENV = 'production';
  config.hostname = os.hostname();
  connection['port'] = process.env.PORT;
  connection['domain'] = '0.0.0.0';
}
config.hostname = 'evh.herokuapp.com';


fs.writeFile("./config/config.js", "var config = " + JSON.stringify(config) + "\nmodule.exports = config;", function(){});

// require custom dispatcher
var dispatcher = require('./lib/dispatcher.js');

console.log('Starting server @ http://127.0.0.1:' + connection['port'] + '/');

http.createServer(function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', '*');
  console.log(req.method);
  if ( req.method === 'OPTIONS' ) {
		res.writeHead(200);
		res.end();
		return;
  }
  // wrap calls in a try catch
  // or the node js server will crash upon any code errors
  try {
    
    // pipe some details to the node console
    console.log('Incoming Request from: ' +
                 req.connection.remoteAddress +
                ' for href: ' + url.parse(req.url).href
    );
  var requestedUrl = url.parse(req.url, true);
	if (requestedUrl.pathname.match("/home/about") && req.method == "GET") {
    fs.readFile("./app/views/home/advert.html", function(err, content) {
      if (err) throw err;
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(content, 'utf-8');
    });
  } else {
    dispatcher.dispatch(req, res);        
  }
  // dispatch our request
  

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
