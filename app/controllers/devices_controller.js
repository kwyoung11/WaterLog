/* 
* This controller will handle the devices pages, including registration,
* My Devices page, etc.
*/

var view = require('../../lib/view');
var db = require('../../lib/db');
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
		var data = {'user_id': params['user_id']};
		view.renderView('devices/new', data, function(data) {
		  callback(data);
		});
	},

	view: function(params, callback) {
			var callback = (typeof callback === 'function') ? callback : function() {};
			var id = params['user_id'];
			Device.findById(id, function(err, data) {
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
	//POST new user
	create: function(params, callback) {
    	var device = new Device(params); // create new user object
    	//var id = device.get('user_id');
    	console.log("IN CREATE FUNCTION FOR USER \n");
    	console.log(params);
    	device.save(function(error,device){
			//data = device.data;
			//console.log("data is: " + JSON.stringify(data));
			//self.response_handler.redirectTo('devices/' + params['user_id'] +'/mydevices');

    	});

	}


}

module.exports = new devices_controller();