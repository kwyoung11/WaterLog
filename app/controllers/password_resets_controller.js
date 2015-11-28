/* 
* This controller will handle everything related to user management.
*/
var view = require('../../lib/view');
var db = require('../../lib/db');
var crypto = require('crypto');
var util = require('../../lib/util');
var User = require('../models/user');
var application_controller = require('./application_controller');
var mailer = require('../../lib/mailer');

/* constructor */
var password_resets_controller = function(response_handler, req, cb) {
	var self = this;
	application_controller.call(this, response_handler, req, function() {
		cb();
	});
};

// inherit properties and methods from application_controller
password_resets_controller.prototype = Object.create(application_controller.prototype);
password_resets_controller.prototype.constructor = password_resets_controller;

/* password_resets_controller prototype methods below */
password_resets_controller.prototype = {
	
	// GET /password_resets/new
	new: function(params, callback) {
		var callback = (typeof callback === 'function') ? callback : function() {};
		// respond with new password_resets page
		console.log(this.view_data);
		view.renderView('password_resets/new', this.view_data, function(data) {
		  callback(data);
		});
	},

	// GET /password_resets/1/edit
	edit: function(params, callback) {
		view.renderView('password_resets/edit', this.view_data, function(data) {
			return callback(data);
		});
	},

	// POST /password_resets
	create: function(params, callback) {
		var self = this;
		// create new user object, passing in the email and password_digest from the post data as params
    var user = User.find('email', params.email, function(err, user) {
    	if (err) {
    		if (self.response_handler.format == 'json') {
    			self.response_handler.renderJSON(200, 'err_code': 99, 'err_msg': 'Error in finding email.');
    		} else {
    			self.view_data.notice = 'Error in finding email';
    			view.renderView('password_resets/new', self.view_data, function(data) {
				  	return callback(data);
					});	
    		}
    	}
    	if (user) {
    		
    		// initialize password_reset fields
    		var password_reset_token = crypto.randomBytes(64).toString('hex');
    		var password_reset_sent_at = Date.now().toString();

    		// update fields in users table
    		user.update({'password_reset_token': password_reset_token, 'password_reset_sent_at': password_reset_sent_at}, function (err, user) {
    			var body = "Hey there," +
					"<p>It looks like you forgot your password when trying to login to our app. Would you like to reset your password?</p>" +
					"<p><a href=\"http://127.0.0.1:3000/password_resets/" + password_reset_token + "/edit\">Reset Password</a></p>" +
					"<p> If not, you can just ignore this email.<p>" +
					"<p> EnviroHub</p>";
					// send password reset email
    			mailer.deliver(user.data.email, "Reset your EnviroHub password", body);	
    			if (self.response_handler.format == 'json') {
    				self.response_handler.renderJSON(200, 'msg': 'An e-mail has been sent to the e-mail address you provided. Check your e-mail for password reset instructions.');
    			} else {
    				GLOBAL.flash.notice = 'An e-mail has been sent to the e-mail address you provided. Check your e-mail for password reset instructions.';
    				self.response_handler.redirectTo("/");
    			}
    				
    		});
    		
    	} else {
    		// render password resets page again
    		if (self.response_handler.format == 'json') {
    			self.response_handler.renderJSON(200, 'err_code': 31, 'err_msg': 'No user found by that e-mail');
    		} else {
    			self.view_data.notice = 'No user found by that e-mail';
    			view.renderView('password_resets/new', self.view_data, function(data) {
				  	return callback(data);
					});	
    		}
    		
    	}
    });
	},

	// PATCH/PUT /password_resets/1
	update: function(params, callback) {
		var self = this;
		User.find('password_reset_token', params['password_reset_token'], function(err, user) {
			var date = new Date();
			// reset_password_token expires after 2 hours
			if (Math.abs(date - user.data.password_reset_sent_at) < 3600000) {
				// update password
				user.data.password_digest = params['password_digest'];
				user.update({'password_digest': params['password_digest']}, function(err, user) {
					if (err) {
						if (self.response_handler.format == 'json') {
							self.response_handler.renderJSON(200, 'err_code': 99, 'err_msg': 'Error in updating password.')
						}	else {
							self.view_data.notice = 'Error in updating password.';
							view.renderView('sessions/new', self.view_data, function(data) {
			  				return callback(data);
							});
						}	
					}
 					if (self.response_handler.format == 'json') {
						self.response_handler.renderJSON(200, 'msg': 'Your password has been reset. Login below.')
					} else {
						self.view_data.notice = 'Your password has been reset. Login below.';
						view.renderView('sessions/new', self.view_data, function(data) {
			  			return callback(data);
						});
					}
					
				});
			} else {
				if (self.response_handler.format == 'json') {
					self.response_handler.renderJSON(200, 'err_code': 30 , 'msg': 'Your password reset token has expired. Request a new one below.');
				} else {
					self.view_data.notice = 'Your password reset token has expired. Request a new one below.';
					view.renderView('password_resets/new', self.view_data, function(data) {
			  		return callback(data);
					});	
				}
				
			}
		});
	},


};

module.exports = password_resets_controller;
