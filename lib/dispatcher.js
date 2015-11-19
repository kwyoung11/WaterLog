var fs = require('fs');
var url = require('url');
// var controller = require('./controller');
var controllers = require("../app/controllers");
var response_handler = require('./response_handler');
var util = require('./util');
var qs = require('querystring');
var application_controller = require('../app/controllers/application_controller');
var config = require('../config/config.js')

this.dispatch = function(req, res) {

  // two ways to specify format: in request header, or appended to URL (e.g., .json)
  var format = req.headers.accept.indexOf('application/json') > 0 ? 'json' : 'html';
  format = req.url.split(".")[1] == 'json' ? 'json' : 'html';
  // set up response object
  responseHandler = new response_handler(res, format);

  var requestedUrl = url.parse(req.url, true);
  var parts, action, controller_name, format, theURL;
  var parameters = {};

  if (requestedUrl.pathname == '/') {
      controller_name = 'home';
      action = 'index';
      if (config.angular_front_end) {
        // route to angular app
        fs.readFile('./app/webroot/views/index.html', 'utf-8', function(error, content) {
          if (error) {
            throw ViewNotFoundException;
          } else {
            responseHandler.renderHtml(content);
          }
        });  
      } else {
        callController(controller_name, action, parameters);
      }
      
  } else {
    format = req.url.split(".")[1];
    if (req.url.indexOf(".") > 0) {
      req.url = req.url.substring(0, req.url.indexOf("."));  
    }
    parts = req.url.split('/');
    
    controller_name = parts[1];
    var extension = requestedUrl.pathname.substring(requestedUrl.pathname.indexOf("."), requestedUrl.pathname.length);
    if (requestedUrl.pathname.indexOf(".") > 0 && extension == 'json' || extension == 'html') {
      requestedUrl.pathname = requestedUrl.pathname.substring(0, requestedUrl.pathname.indexOf("."));
    }
    /* 
    * Routes go below
    */
    // users#new
  
    console.log('controller name is ' + controller_name);
    switch (controller_name) {
      case "invitations":

        // invitations#new
        if (requestedUrl.pathname.match("/invitations/new") && req.method == "GET") {
          action = "new";
          callController(controller_name, action, parameters);

        // invitations#create
        } else if (requestedUrl.pathname.match("/invitations") && req.method == "POST") {
          action = "create";
          util.extractPostData(req, function(post) {
              util.merge(parameters, post);
              callController(controller_name, action, parameters);
          });
        }

        break;        

      case "users":

          // users#new
          if (requestedUrl.pathname.match("/users/new") && req.method == "GET") {
              action = "new";
              parameters['invitation_token'] = parts[3];
              callController(controller_name, action, parameters);
            
            // users#confirm_email
          } else if (requestedUrl.pathname.match(/\/users\/confirm_email\/([a-zA-Z0-9]+)/) && req.method == "GET") {
            action = "confirm_email";
            parameters['email_confirmation_token'] = parts[3];
            callController(controller_name, action, parameters);

             // users#edit
          } else if (requestedUrl.pathname.match(/\/users\/([0-9]+)\/edit/) && req.method == "GET") {
            action = "edit";
            parameters['id'] = parts[2];
            callController(controller_name, action, parameters);

            // users#show  
          } else if (requestedUrl.pathname.match(/^\/users\/\d+$/) && req.method == "GET") {
            action = "show";
            parameters['id'] = parts[2];
            callController(controller_name, action, parameters);

            
            // users#update
          } else if (requestedUrl.pathname.match(/\/users\/([0-9]+)/) && req.method == "POST") {
            action = "update";
            parameters['id'] = parts[2];
            util.extractPostData(req, function(post) {
              util.merge(parameters, post);
              callController(controller_name, action, parameters);
            });
            
            // users#create
          } else if (requestedUrl.pathname.match(/\/users/) && req.method == "POST") {
            action = "create";
            util.extractPostData(req, function(post) {
              util.merge(parameters, post);
              callController(controller_name, action, parameters);
            });
      
            // users#destroy
          } else if (requestedUrl.pathname.match(/\/users\/([0-9]+)\/destroy/) && req.method == "GET") {
            action = "destroy";
            parameters['id'] = parts[2];
            callController(controller_name, action, parameters);
          } 
          break;

      case "password_resets":

        if (requestedUrl.pathname.match("/password_resets/new") && req.method == "GET") {
          action = "new";
          callController(controller_name, action, parameters);
        } else if (requestedUrl.pathname.match(/^\/password_resets$/) && req.method == "POST") {
          action = "create";
          util.extractPostData(req, function(post) {
            util.merge(parameters, post);
            callController(controller_name, action, parameters);
          });
        } else if (requestedUrl.pathname.match(/\/password_resets\/[a-zA-Z0-9]+\/edit/) && req.method == "GET") {
          action = "edit";
          parameters['password_reset_token'] = parts[2];
          callController(controller_name, action, parameters);
        } else if (requestedUrl.pathname.match(/\/password_resets\/([a-zA-Z0-9]+)/) && req.method == "POST") {
          action = "update";
          parameters['password_reset_token'] = parts[2];
          util.extractPostData(req, function(post) {
            util.merge(parameters, post);
            callController(controller_name, action, parameters);
          });
        } 
        break;

      case "devices":

          
          // devices#new
          if (requestedUrl.pathname.match(/\/devices\/new/) && req.method == "GET") {
            action = "new";
            parameters['id']=parts[2];
            callController(controller_name, action, parameters);

          // devices#edit
          } else if (requestedUrl.pathname.match(/\/devices\/([0-9]+)\/edit/) && req.method == "GET") {
            action = "edit";
            parameters['id'] = parts[2];
            callController(controller_name, action, parameters);

          //devices#bulkupload
          }else if (requestedUrl.pathname.match(/\/devices\/([0-9]+)\/bulkupload/) && req.method == "GET"){
            action = "bulkupload";
            parameters['id'] = parts[2];
            callController(controller_name, action, parameters);

          // devices#show
          } else if (requestedUrl.pathname.match(/\/devices\/([0-9]+)/) && req.method == "GET") {
            action = "show";
            parameters['id'] = parts[2];
            callController(controller_name, action, parameters);
                    
            // devices#update
          } else if (requestedUrl.pathname.match(/\/devices\/([0-9]+)\/update/) && req.method == "POST") {
            action = "update";
            parameters['id'] = parts[2];
            util.extractPostData(req, function(post) {
              util.merge(parameters, post);
              callController(controller_name, action, parameters);
            });
            // devices#create
          } else if (requestedUrl.pathname.match(/\/devices/) && req.method == "POST") {
            action = "create";
            parameters['id'] = parts[2];
            util.extractPostData(req, function(post) {
              util.merge(parameters, post);
              callController(controller_name, action, parameters);
            });

          // devices#index 
          } else if (requestedUrl.pathname.match(/\/devices/) && req.method == "GET") {
            action = "index";
            parameters['id'] = parts[2];
            callController(controller_name, action, parameters);
          
          // devices#destroy
          } else if (requestedUrl.pathname.match(/\/devices\/([0-9]+)\/delete/) && req.method == "POST") {
            action = "destroy";
            parameters['id'] = parts[2];
            callController(controller_name, action, parameters);
          }

          break;

      case "data":
        if (requestedUrl.pathname.match("/data/newData") && req.method == "POST") {
        action = "new"; 
        util.extractPostData(req, function(post) {
              util.merge(parameters, requestedUrl.query);
              callController(controller_name, action, parameters); 
              });    
          /*var query = requestedUrl.query;
          for (var key in query) {
            if (query[key]) {
              parameters[key] = query[key];
            }
          }
          callController(controller_name, action, parameters);
          */
        }
        break;

      case "login":
       if (req.method == "GET") {
          controller_name = "sessions";
          action = "new";
          callController(controller_name, action, parameters);  
        } else if (req.method == "POST") {
          controller_name = "sessions";
          action = "create";
          util.extractPostData(req, function(post) {
            if (post) {
              util.merge(parameters, post);
              callController(controller_name, action, parameters);
            }
          });
        }
        break;

      case "logout":
        controller_name = "sessions";
        action = "destroy";
        callController(controller_name, action, parameters);
        break;

      case "mobile":
        if (requestedUrl.pathname.match(/\/mobile\/([0-9]+)\/input/) && req.method == "GET") {
            action = "input";
            parameters['id']=parts[2];
            callController(controller_name, action, parameters);
          }else if (requestedUrl.pathname.match(/\/mobile\/([0-9]+)\/[(a-z)]+\/create/) && req.method == "POST") {
            action = "create";
            parameters['device_id'] = parts[2];
            parameters['data_type'] = parts[3];
            util.extractPostData(req, function(post) {
              util.merge(parameters, post);
              console.log("PRINTING ALL POST DATA\n");
              console.log(parameters);
              callController(controller_name, action, parameters);
            });
          }


      break;

      case "api":
        controller_name = "api";
        var path = requestedUrl.href.split("?")[0];
        var query_params = requestedUrl.href.split("?")[1];
        var query_params_arr = query_params.split("&");
        if (path.match("/api/device") && req.method == "GET") {
          action = "device";
          query_params_arr.forEach(function(elt) {
            var elt_arr = elt.split("=");
            parameters[elt_arr[0]] = elt_arr[1];
          });
          
          console.log("calling controller with parameters: ");
          console.log(parameters);
          callController(controller_name, action, parameters);
        } else if (path.match("/api/users") && req.method == "GET") {
          action = "users";
          query_params_arr.forEach(function(elt) {
            var elt_arr = elt.split("=");
            parameters[elt_arr[0]] = elt_arr[1];
          });
          
          console.log("calling controller with parameters: ");
          console.log(parameters);
          callController(controller_name, action, parameters);
        }
        break;
      default:
        callController(controller_name, action, parameters);
    }
  }
  
  function callController(controller_name, action, parameters) {
    console.log("action is " + action);
    console.log("format is " + format);
    
    // only executing registered actions
    var controller = controllers[controller_name];
    // route to appropriate controller method, otherwise load an asset file
    if (controller) {
    controller = new controller(responseHandler, req, function() {
      console.log(controller.before_filter);
      console.log(controller['before_filter']);
      if (typeof controller.before_filter == 'function') {
        controller.before_filter(action, parameters);
      }

      if (typeof controller[action] == 'function') {
      try {
      controller[action](parameters, function(content, opts) {
    
        if (content) {
        responseHandler.renderHtml(content);
        } else {
        responseHandler.serverError(404);
        }
      });   
      } catch (error) {
      console.log(error);
      }  
    }
    GLOBAL.flash.notice = '';  
    });
    
    } else { // its an asset file
    responseHandler.renderWebroot(requestedUrl);
  }   
  }
};
