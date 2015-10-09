var fs = require('fs');
var url = require('url');
var controller = require('./controller');
var controllers = require("../app/controllers");
var response_handler = require('./response_handler');

this.dispatch = function(req, res) {

  //set up response object
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
    switch (controller_name) {
      case "users":
          controller_name = "users";

          if (requestedUrl.pathname.match("/users/new") && req.method == "GET") {
            action = "new";
            // users#show  
          } else if (requestedUrl.pathname.match("/users/\d") && req.method == "GET") {
            action = "show";
            parameters['id'] = parts[2];
            
            // users#edit
          } else if (requestedUrl.pathname.match("/users/\d/edit") && req.method == "GET") {
            action = "edit";
            parameters['id'] = parts[2];

            // users#create
          } else if (requestedUrl.pathname.match("/users") && req.method == "POST") {
            action = "create";
            // users#update
          } else if (requestedUrl.pathname.match("/users/\d") && req.method == "PUT") {
            action = "update";
            parameters['id'] = parts[2];
            
            // users#destroy
          } else if (requestedUrl.pathname.match("/users/\d") && req.method == "DELETE") {
            action = "destroy";
            parameters['id'] = parts[2];
          }
    }
    
  }

  // only executing registered actions
  if (typeof controllers[controller_name][action] == 'function') {
    try {
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

};