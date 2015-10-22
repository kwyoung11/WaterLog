/* 
* This controller will handle everything related to user management.
*/
var view = require('../../lib/view');
var users_controller = function() {};
users_controller.prototype = {
	
	// GET /users/new
	new: function(params, callback) {
		var callback = (typeof callback === 'function') ? callback : function() {};
		
		var data = null;
		view.renderView('users/new', data, function(data) {
		  callback(data);
		});
	},
 	
 	// GET /users/1
	show: function(params, callback) {
		var callback = (typeof callback === 'function') ? callback : function() {};
		var data =null;
		id = params['id'];
		// load user data here
		var data = {
			  'info' : {
			  	'name': id,
			  	'numdevice':'1',
			  	'viewLink':'/devices/view'
			  }
		};
		view.renderView('users/profile', data, function(data) {
		  callback(data);
		});
	},

	// GET /users/1/edit
	edit: function(params, callback) {

	},

	// POST /users
	create: function(params, callback) {

	},

	// PATCH/PUT /users/1
	update: function(params, callback) {

	},

	// DELETE /users/1
	destroy: function(params, callback) {

	}

};

module.exports = new users_controller();