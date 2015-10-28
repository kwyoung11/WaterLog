/* 
This controller will handle users sessions.
*/

var view = require('../../lib/view');
var bcrypt = require('bcrypt');
var User = require('../models/user');
var util = require('../../lib/util');
var application_controller = require('./application_controller');


var sessions_controller = function(response_handler, req, cb) {
	var self = this;
	application_controller.call(this, response_handler, req, function() {
		cb();
	});
};

// inherit properties and methods from application_controller
sessions_controller.prototype = Object.create(application_controller.prototype);
sessions_controller.prototype.constructor = sessions_controller;

/* sessions_controller prototype methods below */
sessions_controller.prototype = {

	// login page
	new: function(params, cb) {
		
			view.renderView("sessions/new", {'err': false}, function(content) {
				cb(content);
			}); 
		
	},

	// on login submit
	create: function(params, cb) {
		var self = this;
		User.find('email', params['email'], function(err, user) {
			if (err) {
				return cb(err);
			} 
			
				if (user) {
						user.authenticate(params['password_digest'], function(err, authenticated) {
							if (authenticated) {

								// set the users cookie
								self.response_handler.setCookie('envirohub_auth_token', user.data.auth_token);
								
								// redirect to user profile page
								self.response_handler.redirectTo("/users/" + user.data.id);
							} else {
								// there is a user with this e-mail, but the pwd is wrong
								var data = {'err': true, 'err_msg': 'Incorrect password.'};
								view.renderView("sessions/new", data, function(content) {
									return cb(content);
								}); 		
							}
						}); 
				} else {
						// no user by that e-mail
						var data = {'err': true, 'err_msg': 'Incorrect email/password combination.'};
						view.renderView("sessions/new", data, function(content) {
							cb(content);
						}); 		
				}
					
			});
	},

	// /logout
	destroy: function(params, cb) {
		var self = this;
		console.log("in sessions#destroy");
		self.response_handler.setCookie('envirohub_auth_token', '');
		self.response_handler.redirectTo('/');
	}

};

module.exports = sessions_controller;