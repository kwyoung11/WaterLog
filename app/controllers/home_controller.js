var view = require('../../lib/view');
var application_controller = require('./application_controller');
var util = require('../../lib/util');
var home_controller = function(response_handler, req, cb) {
	var self = this;
	application_controller.call(this, response_handler, req, function() {
		self.response_handler = response_handler;
		self.req = req;
		cb();
	});
	
}

// inherit properties and methods from application_controller
home_controller.prototype = Object.create(application_controller.prototype);
home_controller.prototype.constructor = home_controller;

/* home_controller prototype methods below */

home_controller.prototype = {
	
	// GET / (root)
	index: function(params, callback) {
		var callback = (typeof callback === 'function') ? callback : function() {};
		var data = null;
		view.renderView('home/index', this.view_data, function(data) {
		  callback(data);
		});
	},

	info: function(params, callback) {
		var callback = (typeof callback === 'function') ? callback : function() {};
			var data = null;
			view.renderView('home/system_info', this.view_data, function(data) {
			  callback(data);
			});
	}

};

module.exports = home_controller;