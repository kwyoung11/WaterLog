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

	map_controller.prototype.index = function(params, callback) {
			var self = this;
			var callback = (typeof callback === 'function') ? callback : function() {};
			// load user data here
			var data = {};
			view.renderView('map/index', self.view_data, function(content) {
		  		callback(content);
			});
	}

module.exports = map_controller;