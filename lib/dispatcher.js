var fs = require('fs');
var url = require('url');
// var controller = require('./controller');
var controllers = require("../app/controllers");
var response_handler = require('./response_handler');
var util = require('./util');
var qs = require('querystring');

this.dispatch = function(req, res) {

  // set up response object
  responseHandler = new response_handler(res);

  var requestedUrl = url.parse(req.url);
  console.log(req.url);
  console.log("requestedUrl is: " + JSON.stringify(requestedUrl));
  var parts, action, controller_name;
  var parameters = {};

  if (requestedUrl.pathname == '/') {
      controller_name = 'home';
      action = 'index';
  } else {
    parts = req.url.split('/');
    controller_name = parts[1];
    /* 
    * Routes go below
    */
    // users#new
	
	console.log('controller name is ' + controller_name)
    switch (controller_name) {
      case "users":
          controller_name = "users";
          console.log(requestedUrl.pathname.match("/users/\d") && req.method == "GET");
          if (requestedUrl.pathname.match("/users/new") && req.method == "GET") {
            action = "new";
            callController(controller_name, action, parameters);
            // users#show  
          } else if (requestedUrl.pathname.match(/\/users\/\d+/) && req.method == "GET") {
            console.log("IN SHOW branch");
            action = "show";
            parameters['id'] = parts[2];
            callController(controller_name, action, parameters);
            
            // users#edit
          } else if (requestedUrl.pathname.match("/users/\d/edit") && req.method == "GET") {
            action = "edit";
            parameters['id'] = parts[2];

            // users#create
          } else if (requestedUrl.pathname.match("/users") && req.method == "POST") {
            action = "create";
            util.extractPostData(req, function(post) {
              util.merge(parameters, post);
              callController(controller_name, action, parameters);
            });
      
            // users#update
          } else if (requestedUrl.pathname.match("/users/\d") && req.method == "PUT") {
            action = "update";
            parameters['id'] = parts[2];
            
            // users#destroy
          } else if (requestedUrl.pathname.match("/users/\d") && req.method == "DELETE") {
            action = "destroy";
            parameters['id'] = parts[2];
          }
      default:
        callController(controller_name, action, parameters);
    }
    
  }


  function callController(controller_name, action, parameters) {
    // only executing registered actions
    // controller = new controllers['users'](responseHandler)
    // console.log(new controllers['users'](responseHandler)); 
    // console.log(controller[action);
    controller = controllers[controller_name];
    controller = new controller(responseHandler);
    
    if (typeof controller[action] == 'function') {
      try {
        // console.log(Object.keys(controllers[controller_name]));
        // console.log("Parameters are: " + JSON.stringify(parameters));
        controller[action](parameters, function(content, opts) {
          // console.log("Opts are: " + JSON.stringify(opts));
          // if (opts) {
          //   res.writeHead(200, {'cookie': opts.data.auth_token});
          // }

          console.log("WHATTUPUPUP");

          if (content) {
            responseHandler.renderHtml(content);
          } else {
            responseHandler.serverError(404);
          }
        });   
      } catch (error) {
        console.log(error);
      }
    } else {
      responseHandler.renderWebroot(requestedUrl);
    }
  }
  

};