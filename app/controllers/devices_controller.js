/* 
* This controller will handle the devices pages, including registration,
* My Devices page, etc.
*/


var view = require('../../lib/view');
var db = require('../../lib/db');
var crypto = require('crypto');
var util = require('../../lib/util');
var Device = require('../models/device');
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
			console.log(self);
			Device.findByUser(self.current_user.data.id, function(err, devices) {
				console.log("DEVICE DATA \n");
				console.log(devices);
				var data = {'devices' : devices, 'id': self.current_user.data.id};
				view.renderView('devices/index', data, function(content) {
		  		callback(content);
			});
		});
		
	},

	show: function(params, callback) {
		var callback = (typeof callback === 'function') ? callback : function() {};

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
		console.log(self);
		params['id'] = self.current_user.data.id;
    	var device = new Device(params); // create new device object
    	device.save(function(dev) {
				self.response_handler.redirectTo('/users/' + self.current_user.data.id);
    	});
	},

	update: function(params, callback) {
		var self = this;
//<<<<<<< HEAD
		//Device.findById(params['id'], function(err,data){
//=======
		console.log("UPDATING DEVICE\n");
		console.log(params);
		Device.findById(params['id'], function(err, data){
//>>>>>>> 6630cc04199f2ff144a131ade06696efb76ede00
			data['latitude'] = params['latitude'];
			data['longitude'] = params['longitude'];
			var device = new Device(data);
    		device.update(function(dev) {
				self.response_handler.redirectTo('/devices/' + device.data.id);
    		});
		});
	}

}

module.exports = devices_controller;