/* 
* This controller will handle the map page
*/

var view = require('../../lib/view');
var db = require('../../lib/db');
var util = require('../../lib/util');
var Device = require('../models/device');
var User = require('../models/user');
var application_controller = require('./application_controller');

/* constructor */
var map_controller = function(response_handler, req, cb) {
	var self = this;
	application_controller.call(this, response_handler, req, function() {
		self.response_handler = response_handler;
		self.req = req;
		cb();
	});
};
// inherit properties and methods from application_controller
map_controller.prototype = Object.create(application_controller.prototype);
map_controller.prototype.constructor = map_controller;

map_controller.prototype = {

	// before_filter: function (action, params) {
	// 	var self = this;
	// 	if (["show", "edit", "update", "destroy"].indexOf(action) >= 0) {
	// 		Device.findById(params['id'], function(err1, device) {
	// 			User.findById(device.user_id, function(err2, user) {
	// 				if (!device.id) {
	// 					self.response_handler.serverError(404, "Resource not found.");
	// 				} else if (device.user_id != self.current_user.data.id && user.data.private_profile) {
	// 					self.response_handler.serverError(403, "This user has set their account data to be private.");
	// 				}
	// 			});
				
	// 		});

	// 		Device.findByUser(self.current_user.data.id, function(err, devices){
	// 			var resource_found = false;
	// 			for (device in devices) {
	// 				if (device.id == params['id']) {
	// 					resource_found = true;
	// 				}
	// 			}
	// 			if (!resource_found) {
	// 				self.response_handler.serverError(404, "Resource not found");
	// 			}
	// 		});
	// 	}
	// },

	// before_action: function (action, params) {

	// },

	index: function(params, callback) {
			var self = this;
			var callback = (typeof callback === 'function') ? callback : function() {};
			// load user data here
			var data = {};
			view.renderView('map/index', data, function(content) {
		  		callback(content);
			});
	},

}

module.exports = map_controller;