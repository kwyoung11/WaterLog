/* 
* This controller will handle the devices pages, including registration,
* My Devices page, etc.
*/


var view = require('../../lib/view');
var db = require('../../lib/db');
var crypto = require('crypto');
var util = require('../../lib/util');
var Device = require('../models/device');
var Data = require('../models/data');
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

	devices_controller.prototype.before_filter = function (action, params, cb) {
		var self = this;
		if (["show", "edit", "update", "destroy"].indexOf(action) >= 0) {
			Device.findById(params['id'], function(err1, device) {
				User.findById(device.user_id, function(err2, user) {
					if (!device || !device.data.id) {
						return cb([404, "Resource not found"]);
					} else if (user.data.private_profile) {
						return cb([403, "This user has set their account data to be private."]);
						// return self.response_handler.serverError(403, "This user has set their account data to be private.");
					} else {
						cb(null);
					}
				});
			});
		} else {
      cb(null);
		}
	}

	//GET /devices/new
	devices_controller.prototype.new = function(params, callback) {
		var self = this;
		var callback = (typeof callback === 'function') ? callback : function() {};
		self.view_data.id = params['id'];
		
		view.renderView('devices/new', self.view_data, function(data) {
				callback(data);
		});			
	}

	devices_controller.prototype.index = function(params, callback) {
			var self = this;
			var callback = (typeof callback === 'function') ? callback : function() {};
			// load user data here
			Device.findByUser(self.current_user.data.id, function(err, devices) {
				var data = {'devices' : devices, 'id': self.current_user.data.id};
				view.renderView('devices/index', data, function(content) {
		  		callback(content);
			});
		});
		
	}

	devices_controller.prototype.show = function(params, callback) {
		var self = this;
		var callback = (typeof callback === 'function') ? callback : function() {};
		
		Device.findById(params['id'], function(err, device_data) {
				Data.find(device_data.data.id, function(err, result) {
					util.merge(self.view_data, device_data.data);
					var obj = [];
					for (j = 0; j < result.rows.length; j++) {
						obj[j] = {};
						obj[j]['other_data'] = result.rows[j];
						for (i = 0; i < result.rows[j].keys.length; i++) {
							obj[j][result.rows[j].keys[i]] = result.rows[j].values[i];
						}
					}
					util.merge(self.view_data, {'device_data': [obj]});
					console.log("VIEW DATA IS: ");
					console.log(self.view_data);
					view.renderView('devices/show', self.view_data, function(content) {
		  			callback(content);
					});
				});
				
		});
	}

	devices_controller.prototype.edit = function(params, callback) {
		var self = this;
		var callback = (typeof callback === 'function') ? callback : function() {};
		Device.findById(params['id'], function(err, device_data) {
			util.merge(self.view_data, device_data.data);
			view.renderView('devices/edit', self.view_data, function(content) {
		  	callback(content);
			});			
		});
	}

	// POST new user
	devices_controller.prototype.create = function(params, callback) {
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
	}

	devices_controller.prototype.update = function(params, callback) {
		var self = this;
		console.log(params);
		Device.findById(params['id'], function(err, device) {
    		device.update(params, function(err, device) {
    			if (err) {
    				if (self.response_handler.format == 'json') {
    					self.response_handler.renderJSON(200, {'err_code': 21, 'err_msg': 'Error in updating device.'});
						} else {
							GLOBAL.flash.notice = 'There was an error updating your device';
							self.response_handler.redirectTo('/users/' + self.current_user.data.id);	
						}	
    			}

    			if (self.response_handler.format == 'json') {
    				self.response_handler.renderJSON(200, device);
					} else {
						GLOBAL.flash.notice = 'Device updated succesfully';
						self.response_handler.redirectTo('/devices/' + device.data.id);
					}
    		});
		});
	}

	devices_controller.prototype.bulkupload = function(params, callback) {
		var self = this;
		var callback = (typeof callback === 'function') ? callback : function() {};
		//var device = new Device(params);
		Device.findById(params['id'], function(err, device_data) {
			util.merge(self.view_data, device_data);
			view.renderView('devices/bulk_upload', self.view_data, function(content) {
		  		callback(content);
			});
		});
	}

module.exports = devices_controller;
