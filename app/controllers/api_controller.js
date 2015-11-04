/* 
* This controller will handle everything related to user management.
*/
var view = require('../../lib/view');
var db = require('../../lib/db');
var crypto = require('crypto');
var util = require('../../lib/util');
var User = require('../models/user');
var Device = require('../models/device'); 
var application_controller = require('./application_controller');

/* constructor */
var api_controller = function(response_handler, req, cb) {
	var self = this;
	application_controller.call(this, response_handler, req, function() {
		self.response_handler = response_handler;
		self.req = req;
		cb();
	});
};
// inherit properties and methods from application_controller
api_controller.prototype = Object.create(application_controller.prototype);
api_controller.prototype.constructor = api_controller;

/* api_controller prototype methods below */
api_controller.prototype = {
	
	device: function (params, cb) {
		var self = this;
		if (params.location && params.radius) {
			var latitude = params.location.split(",")[0];
			var longitude =params.location.split(",")[1];
			var top = latitude + (params.radius/69);
			var bot = latitude - (params.radius/69);
			var right = longitude + (params.radius/54);
			var left = longitude - (params.radius/54);
			db.query("SELECT * from devices WHERE longitude BETWEEN $1 AND $2 AND latitude BETWEEN $3 AND $4", [right, left, bot, top], function(err, result) {
				if (err) {
					console.log(err);
					return cb(err);
				}
				return self.response_handler.renderJSON(200, result.rows[0])
				console.log(result);
			});
		}
	},

	users: function(params, cb) {

	}

};

module.exports = api_controller;
