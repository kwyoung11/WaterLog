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
		//console.log(params);
		view.renderView('devices/new', data, function(data) {
		  callback(data);
		});
	},

	view: function(params, callback) {
			var self = this;
			var callback = (typeof callback === 'function') ? callback : function() {};
			// load user data here
			Device.findById(params['id'], function(err, device_data) {
				//console.log("DEVICE DATA \n");
				//console.log(device_data);
				var data= {'device' : device_data, 'id': params['id']};
				view.renderView('devices/view', data, function(content) {
		  		callback(content);
			});
		});
		
	},
	//GET update page which is same page as new but with the stuff already filled in
	update: function(params, callback) {
		var callback = (typeof callback === 'function') ? callback : function() {};
		var id =params['user_id'];
		Device.findById(id, function(err,data){
			view.renderView('/devices/new', data, function(data) {
		  		callback(data);
			});
		});
		
	},
	destroy: function(params, callback) {
		var callback = (typeof callback === 'function') ? callback : function() {};
		
		var data = null;
		view.renderView('/devices/new', data, function(data) {
		  callback(data);
		});
	},

	show: function(params, callback) {
		var callback = (typeof callback === 'function') ? callback : function() {};
		view.renderView('/devices/show', params, function(data) {
		  callback(data);
		});
	},
	edit: function(params, callback) {
		var callback = (typeof callback === 'function') ? callback : function() {};
		view.renderView('/devices/edit', params, function(data) {
		  callback(data);
		});
	},
	//POST new user
	create: function(params, callback) {
		var self = this;
		var x= parseInt(params['id']);
		params['id']=x;
    	var device = new Device(params); // create new user object
    	//var id = device.get('user_id');
    	console.log("IN CREATE FUNCTION FOR DEVICE \n");
    	console.log(params);
    	//console.log(params);
    	device.save(function(dev){
			//if (dev) {
				self.response_handler.redirectTo('/devices/' +params['id']);
			//}
    	});

	}


}

module.exports = devices_controller;