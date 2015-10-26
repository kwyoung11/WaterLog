/* 
This controller will handle users sessions.
*/

var view = require('../../lib/view');
var sessions_controller = function(response_handler) {
	this.response_handler = response_handler;
};

sessions_controller.prototype = {

	// login page
	new: function(params, cb) {
		view.renderView("sessions/new", null, function(content) {
			cb(content);
		}); 
	},

	// on login submit
	create: function(params, cb) {
		
	},

	// /logout
	destroy: function(params, cb) {
		
	}

};

module.exports = sessions_controller;