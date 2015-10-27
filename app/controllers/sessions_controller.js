/* 
This controller will handle users sessions.
*/

var view = require('../../lib/view');
var bcrypt = require('bcrypt');
var User = require('../models/user');
var util = require('../../lib/util');

var sessions_controller = function(response_handler, req) {
	this.response_handler = response_handler;
	this.req = req;
};

sessions_controller.prototype = {

	// login page
	new: function(params, cb) {
		User.find('id', 1, function(err, result) {
			console.log("IN FIND");
			console.log(result);
			view.renderView("sessions/new", {'err': false}, function(content) {
				cb(content);
			}); 
		});
	},

	// on login submit
	create: function(params, cb) {
		User.find('email', params['email'], function(err, user) {
				if (user) {
						user.authenticate(params['password_digest'], user['salt'], function(err, authenticated) {
							if (authenticated) {

								// set the users cookie
								response_handler.setCookie('auth_token', user.auth_token);
								
								// redirect to user profile page
								response_handler.redirectTo("/users/" + user.id);
							} else {
								// render login page again with error message
								var data = {'err': true, 'err_msg': 'Incorrect email/password combination.'};
								view.renderView("sessions/new", data, function(content) {
									cb(content);
								}); 		
							}
						}); 
				}
					
			});
	},

	// /logout
	destroy: function(params, cb) {
		
	}

};

module.exports = sessions_controller;