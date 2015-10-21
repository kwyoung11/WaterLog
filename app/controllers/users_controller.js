/* 
* This controller will handle everything related to user management.
*/
var view = require('../../lib/view');
var db = require('../../lib/db');
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var util = require('../../lib/util');
var users_controller = function() {};
users_controller.prototype = {
	
	// GET /users/new
	new: function(params, callback) {
		var callback = (typeof callback === 'function') ? callback : function() {};
		data = null;
		console.log("THIS IS THE REQUEST: " + req);
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
		var toby = new User(params);
		// create the users authentication token, which will be stored in a cookie
		var token = crypto.randomBytes(64).toString('hex');
		
		// generate a salt, then encrypt the inputted password with that salt
		bcrypt.genSalt(10, function(err, salt) {
    	bcrypt.hash('B4c0/\/', salt, function(err, hash) {

    	    // create a new user in the database, storing the hashed password along with the salt
					db.query("INSERT INTO users (email, password_digest, auth_token, salt) VALUES ($1, $2, $3, $4)", [params['email'], hash, token, salt], function(err, result) {

						// the user has now succesfully registered, lets initialize his cookie
						util.cookie = token;
						data = result.rows[0];
						view.renderView('users/show', data, function(data) {
						  callback(data);
						});				
					});
    	});
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