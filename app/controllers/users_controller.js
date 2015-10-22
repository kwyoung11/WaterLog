/* 
* This controller will handle everything related to user management.
*/
var view = require('../../lib/view');
var db = require('../../lib/db');
var crypto = require('crypto');
var util = require('../../lib/util');
var users_controller = function() {};
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
		var data = null;
		view.renderView('users/show', data, function(data) {
		  callback(data);
		});
	},

	// GET /users/1/edit
	edit: function(params, callback) {

	},

	// POST /users
	create: function(params, callback) {
    var user = new User(params); // create new user object
    user.save(function(err, user) { // store user info in database
			// the user has now succesfully registered, lets initialize his cookie
    	util.cookie = user.auth_token;
			data = {'user': user}
			view.renderView('users/show', data, function(data) {
			  callback(data);
			});				
    });
    	    
		console.log("Params are: " + JSON.stringify(params));
		var data = null;
		view.renderView('users/show', data, function(data) {
			callback(data);
		});	

		
		// set the users auth token in a cookie

		// respond with User Profile page

	},

	// PATCH/PUT /users/1
	update: function(params, callback) {

	},

	// DELETE /users/1
	destroy: function(params, callback) {

	}

};

module.exports = new users_controller();