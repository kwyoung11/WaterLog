/* 
* This controller will handle mobile upload of data
*/


var view = require('../../lib/view');
var db = require('../../lib/db');
var crypto = require('crypto');
var util = require('../../lib/util');
var Data = require('../models/data');
var application_controller = require('./application_controller');
var Mobile = require('../models/mobile');

/* constructor */
var mobile_controller = function(response_handler, req, cb) {
	var self = this;
	application_controller.call(this, response_handler, req, function() {
		self.response_handler = response_handler;
		self.req = req;
		cb();
	});
};
// inherit properties and methods from application_controller
mobile_controller.prototype = Object.create(application_controller.prototype);
mobile_controller.prototype.constructor = mobile_controller;

mobile_controller.prototype = {

	//GET /devices/new
	input: function(params, callback) {
		console.log("IN INPUT IN MOBILE CONTROLLER\n");
		var callback = (typeof callback === 'function') ? callback : function() {};
		view.renderView('mobile/input', params, function(data) {
		  callback(data);
		});
	}//,

	/*update: function(params, callback) {
		var self = this;
		Device.findById(params['id'], function(err,data){
			data['latitude'] = params['latitude'];
			data['longitude'] = params['longitude'];
			var device = new Device(data);
    		device.update(function(dev) {
				self.response_handler.redirectTo('/devices/' +device.id);
    		});
		});
	}*/
}

module.exports = mobile_controller;