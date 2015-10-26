/* 
* This controller will handle everything related to user management.
*/
var view = require('../../lib/view');
var db = require('../../lib/db');
var crypto = require('crypto');
var util = require('../../lib/util');
var User = require('../models/user');
var users_controller = function(response_handler) {
	this.response_handler = response_handler;
};

users_controller.prototype = {
	
	// GET /users/new
	new: function(params, callback) {
		var callback = (typeof callback === 'function') ? callback : function() {};
		data = null;
		// respond with login/registration page
		view.renderView('users/new', data, function(data) {
		  callback(data);
		});
	},
 	
 	// GET /users/1
	show: function(params, callback) {
		var callback = (typeof callback === 'function') ? callback : function() {};
		
		// load user data here
		var data = User.findById(params['id'], function(err, user_data) {
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
    console.log("HERE1");
    var user = new User(params); 
		console.log("HERE2");
    user.save(function(err, user) { // store user info in database
			// the user has now succesfully registered, lets initialize his cookie
			console.log("IN SAVE callback");
			user.data.id = 1;
			data = user.data;
			console.log("data is: " + JSON.stringify(data));
			self.response_handler.redirectTo('users/' + user.data.id);
			// view.renderView('users/show', data, function(data) {
			//   callback(data, user);
			// });				
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