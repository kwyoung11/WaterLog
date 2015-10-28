/* 
* This controller will handle everything related to user management.
*/
var view = require('../../lib/view');
var db = require('../../lib/db');
var crypto = require('crypto');
var util = require('../../lib/util');
var User = require('../models/user');
var application_controller = require('./application_controller');

/* constructor */
var users_controller = function(response_handler, req, cb) {
	var self = this;
	application_controller.call(this, response_handler, req, function() {
		self.response_handler = response_handler;
		self.req = req;
		cb();
	});
};
// inherit properties and methods from application_controller
users_controller.prototype = Object.create(application_controller.prototype);
users_controller.prototype.constructor = users_controller;

/* users_controller prototype methods below */
users_controller.prototype = {
	
	// GET /users/new
	new: function(params, callback) {
		var callback = (typeof callback === 'function') ? callback : function() {};
		// respond with login/registration page
		console.log(this.view_data);
		view.renderView('users/new', this.view_data, function(data) {
		  callback(data);
		});
	},
 	
 	// GET /users/1
	show: function(params, callback) {
		var callback = (typeof callback === 'function') ? callback : function() {};
		console.log(this.view_data);
		// load user data here
		User.findById(params['id'], function(err, user_data) {
			view.renderView('users/show', user_data, function(content) {
		  	callback(content);
			});
		});
		
	},

	// GET /users/1/edit
	edit: function(params, callback) {

	},

	// POST /users
	create: function(params, callback) {
		var self = this;
		// create new user object, passing in the email and password_digest from the post data as params
    var user = new User(params); 
    user.save(function(err, user) { // store user info in database

			if (err) { // re-render login page, displaying any login errors
				if (err.code == '23505') { // code 23505 is a unique constraint violation
					var errors = {'err': true, 'err_msg': 'That e-mail is already registered. Please choose another e-mail'};
					view.renderView('users/new', errors, function(data) {
			  		return callback(data);
					});					
				} else { // there was an error, but we're not sure what it was exactly
					var errors = {'err': true, 'err_msg': 'Something went wrong. Please contact us at support@envirohub.com for help.'};
					view.renderView('users/new', errors, function(data) {
			  		return callback(data);
					});					
				}
			}

			if (user) {
				// the user is registered, set his cookie
				self.response_handler.setCookie('envirohub_auth_token', user.auth_token);
				// redirect to users#show
				self.response_handler.redirectTo('users/' + user.id);	
			} 
			
			
    });
    	    
		// console.log("Params are: " + JSON.stringify(params));
		// var data = null;
		// view.renderView('users/show', data, function(data) {
		// 	callback(data, user);
		// });	
	},

	// PATCH/PUT /users/1
	update: function(params, callback) {

	},

	// DELETE /users/1
	destroy: function(params, callback) {

	}

};

module.exports = users_controller;
