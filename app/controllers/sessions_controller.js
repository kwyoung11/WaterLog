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


	// login page
	sessions_controller.prototype.new = function(params, cb) {

			view.renderView("sessions/new", this.view_data, function(content) {
				cb(content);
			}); 
		
	},

	// on login submit
	sessions_controller.prototype.create = function(params, cb) {
		var self = this;
		User.find('email', params['email'], function(err, user) {
			if (err) {
				self.response_handler.renderJSON(200, {'err_code': 09, 'err_msg': 'Something went wrong. Please contact envirohubapp@gmail.com for help.'});
				return cb(err);
			} 

			if (user && user.data.failed_login_attempts == 3 && Math.abs(user.data.last_failed_login - new Date()/1000) >= 900) {
				// reset failed_login_attempts and last_failed_login
				user.update({'failed_login_attempts': 0});
			} 
				
				if (user) {
					console.log(user.data);
					console.log(Math.abs(user.data.last_failed_login - new Date()/1000));
					if (user.data.failed_login_attempts == 3 && Math.abs(user.data.last_failed_login - new Date()/1000) < 900) {
						self.view_data.notice = "Too many failed login attempts. Try again in " + ((900 - Math.abs(user.data.last_failed_login - new Date()/1000)) / 60) + " minutes";
						view.renderView("sessions/new", self.view_data, function(content) {
							return cb(content);
						}); 			
					} else {
						user.authenticate(params['password_digest'], function(err, authenticated) {
							if (authenticated) {

								// set the users cookie
								self.response_handler.setCookie('envirohub_auth_token', user.data.auth_token);
								// redirect to user profile page
								if (self.response_handler.format == 'json') {
									self.response_handler.renderJSON(200, user.data);
								} else {
									self.response_handler.redirectTo("/users/" + user.data.id);	
								}
								
							} else {
								// there is a user with this e-mail, but the pwd is wrong
								var data = {'err_code': 02, 'err_msg': 'Incorrect password.'};
								user.update({'failed_login_attempts': user.data.failed_login_attempts + 1, 'last_failed_login': new Date()/1000}, function() {
									if (self.response_handler.format == 'json') {
										self.response_handler.renderJSON(200, data);
									} else {
										view.renderView("sessions/new", data, function(content) {
											return cb(content);
										}); 			
									}	
								});
							}
						}); 
					}
						
				} else {
						// no user by that e-mail
						var data = {'err_code': 01, 'err_msg': 'Incorrect email.'};
						if (self.response_handler.format == 'json') {
							self.response_handler.renderJSON(200, data);
						} else {
							view.renderView("sessions/new", data, function(content) {
								cb(content);
							}); 			
						}
				}
					
			});
	},

	// /logout
	sessions_controller.prototype.destroy = function(params, cb) {
		var self = this;
		self.response_handler.setCookie('envirohub_auth_token', '');
		if (self.response_handler.format == 'json') {
			self.response_handler.renderJSON(200, 'Success');
		} else {
			self.response_handler.redirectTo('/');	
		}
	}

module.exports = sessions_controller;
