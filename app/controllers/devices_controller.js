/* 
* This controller will handle the devices pages, including registration,
* My Devices page, etc.
*/


var view = require('../../lib/view');
var db = require('../../lib/db');
var crypto = require('crypto');
var util = require('../../lib/util');
var Device = require('../models/device');
var User = require('../models/user');
var application_controller = require('./application_controller');

/* constructor */
var devices_controller = function(response_handler, req, cb) {
	var self = this;
	application_controller.call(this, response_handler, req, function() {
		self.response_handler = response_handler;
		self.req = req;
		cb();
	});
};
// inherit properties and methods from application_controller
devices_controller.prototype = Object.create(application_controller.prototype);
devices_controller.prototype.constructor = devices_controller;

devices_controller.prototype = {

	before_filter: function (action, params) {
		var self = this;
		if (["show", "edit", "update", "destroy"].indexOf(action) >= 0) {
			Device.findById(params['id'], function(err1, device) {
				User.findById(device.user_id, function(err2, user) {
					if (!device.id) {
						self.response_handler.serverError(404, "Resource not found.");
					} else if (device.user_id != self.current_user.data.id && user.data.private_profile) {
						self.response_handler.serverError(403, "This user has set their account data to be private.");
					}
				});
				
			});

			Device.findByUser(self.current_user.data.id, function(err, devices){
				var resource_found = false;
				console.log(devices);
				console.log(devices[0]['id']);

				for (var ind in devices) {
					//console.log("device.id "+devices[ind]['id']+" params['id'] " +params['id']+ "\n");
					if (devices[ind]['id'] == params['id']) {
						resource_found = true;
					}
				}
				//console.log("RESOURCE FOUND IS "+resource_found+"\n");
				if (!resource_found) {
					//console.log("IN BEFORE FILTER\n");
					self.response_handler.serverError(404, "Resource not found");
				}
			});
		}
	},

	before_action: function (action, params) {

	},

	//GET /devices/new
	new: function(params, callback) {
		var callback = (typeof callback === 'function') ? callback : function() {};
		var data = {'id': params['id']};
		// console.log(params);
			view.renderView('devices/new', data, function(data) {
		  		callback(data);
			});			
		
		
	},

	index: function(params, callback) {
			var self = this;
			var callback = (typeof callback === 'function') ? callback : function() {};
			// load user data here
			Device.findByUser(self.current_user.data.id, function(err, devices) {
				var data = {'devices' : devices, 'id': self.current_user.data.id};
				view.renderView('devices/index', data, function(content) {
		  		callback(content);
			});
		});
		
	},

	show: function(params, callback) {
		var callback = (typeof callback === 'function') ? callback : function() {};
		console.log("HERE\n");
		Device.findById(params['id'], function(err, device_data) {
				//console.log("DEVICE DATA\n");
				//console.log(device_data);
				view.renderView('devices/show', device_data, function(content) {
		  		callback(content);
			});
		});
	},

	edit: function(params, callback) {
		var callback = (typeof callback === 'function') ? callback : function() {};
		Device.findById(params['id'], function(err, device_data) {
			view.renderView('devices/edit', device_data, function(content) {
		  	callback(content);
			});			
		});
	},

	// POST new user
	create: function(params, callback) {
		var self = this;
		params['user_id'] = self.current_user.data.id;
    	var device = new Device(params); // create new device object
    	device.save(function(err, dev) {
    		if (err) {
    			if (self.response_handler.format == 'json') {
    				self.response_handler.renderJSON(200, {'err_code': 21, 'err_msg': 'Error in creating device.'});
					} else {
						GLOBAL.flash.notice = 'There was an error registering your device';
						self.response_handler.redirectTo('/users/' + self.current_user.data.id);	
					}	
    		}
    		if (self.response_handler.format == 'json') {
    			self.response_handler.renderJSON(200, dev);
				} else {
					self.response_handler.redirectTo('/users/' + self.current_user.data.id);	
				}
				
    	});
	},

	update: function(params, callback) {
		var self = this;
		Device.findById(params['id'], function(err, data) {
			data['name'] = params['name'];
			data['latitude'] = params['latitude'];
			data['longitude'] = params['longitude'];

			var device = new Device(data);
    		device.update(function(err, dev) {
    			if (err) {
    				if (self.response_handler.format == 'json') {
    					self.response_handler.renderJSON(200, {'err_code': 21, 'err_msg': 'Error in updating device.'});
						} else {
							GLOBAL.flash.notice = 'There was an error updating your device';
							self.response_handler.redirectTo('/users/' + self.current_user.data.id);	
						}	
    			}

    			if (self.response_handler.format == 'json') {
    				self.response_handler.renderJSON(200, dev);
					} else {
						GLOBAL.flash.notice = 'There was an error registering your device';
						self.response_handler.redirectTo('/devices/' + device.data.id);
					}
    		});
		});
	},

	bulkupload: function(params, callback) {
		var callback = (typeof callback === 'function') ? callback : function() {};
		//var device = new Device(params);
		Device.findById(params['id'], function(err, device_data) {
			console.log("PASSING DEVICE_DATA FOR BULK UPLOAD");
			console.log(device_data);
			view.renderView('devices/bulk_upload', device_data, function(content) {
		  		callback(content);
			});
		});
	}

}

module.exports = devices_controller;