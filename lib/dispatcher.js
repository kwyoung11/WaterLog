var fs = require('fs');
var url = require('url');
var controller = require('./controller');
var controllers = require("../app/controllers");
var response_handler = require('./response_handler');
var util = require('./util');
var qs = require('querystring');

this.dispatch = function(req, res) {

  // util.setRequest(req);
  // var post = util.extractPostData(req);
  // console.log("POST data is: " + JSON.stringify(post));
  // set up response object
  responseHandler = new response_handler(res);

  var requestedUrl = url.parse(req.url);
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
          //controller_name = "users";

          if (requestedUrl.pathname.match(/\/users\/new/) && req.method == "GET") {
            action = "new";
            callController(controller_name, action, parameters);
            // users#show  
          } else if (requestedUrl.pathname.match(/\/users\/([0-9]+)/) && req.method == "GET") {
            action = "show";
            parameters['id'] = parts[2]; //passes the number id in url to show in user_controllers.js
            
            // users#edit
          } else if (requestedUrl.pathname.match(/\/users\/([0-9]+)\/edit/) && req.method == "GET") {
            action = "edit";
            parameters['id'] = parts[2];

            // users#create
          } else if (requestedUrl.pathname.match(/\/users/) && req.method == "POST") {
            action = "create";
            util.extractPostData(req, function(post) {
              util.merge(parameters, post);
              callController(controller_name, action, parameters);
            });
      
            // users#update
          } else if (requestedUrl.pathname.match(/\/users\/([0-9]+)/) && req.method == "PUT") {
            action = "update";
            parameters['id'] = parts[2];
            
            // users#destroy
          } else if (requestedUrl.pathname.match(/\/users\/([0-9]+)/) && req.method == "DELETE") {
            action = "destroy";
            parameters['id'] = parts[2];
          }
    case "devices":
          //controller_name = "devices";

          if (requestedUrl.pathname.match(/\/devices\/new/) && req.method == "GET") {
            action = "add";
            // users#show  
          } else if (requestedUrl.pathname.match(/\/devices\/view/) && req.method == "GET") {
            action = "view";
            parameters['id'] = parts[2];
          } else if (requestedUrl.pathname.match(/\/devices\/([0-9]+)\/update/) && req.method == "PUT") {
            action = "update";
            parameters['id'] = parts[2];
            // users#destroy
          } else if (requestedUrl.pathname.match(/\/devices\/([0-9]+)\/delete/) && req.method == "DELETE") {
            action = "destroy";
            parameters['id'] = parts[2];
          }  
      default:
        callController(controller_name, action, parameters);
    }
  }
  function callController(controller_name, action, parameters) {
    // only executing registered actions
    if (typeof controllers[controller_name][action] == 'function') {
      try {
        console.log("Parameters are: " + JSON.stringify(parameters));
        controllers[controller_name][action](parameters, function(content) {
  
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