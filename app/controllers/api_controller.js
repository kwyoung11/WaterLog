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
api_controller.prototype.before_filter = function(params, cb) {
	var self = this;
	if (params(['user_id'])) {
		User.findById(params['user_id'], function(err, user) {
			if (user.data.is_admin && user.data.private_profile) {
				cb([200, "This data is restricted. The user to which this data belongs to has chosen to keep their data private."], {'response_format': 'JSON'});
				self.response_handler.renderJSON(200, "This data is restricted. The user to which this data belongs to has chosen to keep their data private.");		
			} else {
				cb(null);	
			}
		});
	} else if (params['device_id']) {
		Device.findById(params['device_id'], function(err, device) {
			User.findById(device.data.user_id, function(err, user) {
				if (user.data.is_admin && user.data.private_profile) {
					cb([200, "This data is restricted. The user to which this data belongs to has chosen to keep their data private."], {'response_format': 'JSON'});
				} else {
					cb(null);		
				}
				
			});	
		});
	} else {
		cb([200, "Unrecognized API endpoint. See site documentation for API specifications."], {'response_format': 'JSON'});		
	}
}

	api_controller.prototype.device = function (params, cb) {
		var self = this;
		var query_params;
		if (params.location && params.radius) { // get devices with x mile radius of lat, lon
			var latitude = params.location.split(",")[0];
			var longitude = params.location.split(",")[1];
			var top = latitude - (params.radius/69) + (2*(params.radius/69));
			var bot = latitude - (params.radius/69);
			var right = longitude - (params.radius/54) + (2*(params.radius/54));
			var left = longitude - (params.radius/54);
			db.query("SELECT * from devices WHERE cast(longitude as double precision) BETWEEN $1 AND $2 AND cast(latitude as double precision) BETWEEN $3 AND $4", [left, right, bot, top], function(err, result) {
				if (err) {
					console.log(err);
					return cb(err);
				}
				console.log(result);
				return self.response_handler.renderJSON(200, result.rows);
			});

		// get all data records for device
		} else if (!params.start_time && !params.latest_record) { 
			db.query("SELECT * from data WHERE device_id = $1", [params.device_id], function(err, result) {
				if (err) {
					console.log(err);
					return cb(err);
				}
				console.log(result);
				return self.response_handler.renderJSON(200, result.rows);
			});

		// get all data records for device within specified time period	
		} else if (params.start_time && params.end_time) { 
			db.query("SELECT * from data WHERE device_id = $1 AND created_at BETWEEN $2 AND $3", [params.device_id, params.start_time, params.end_time], function(err, result) {
				if (err) {
					console.log(err);
					return cb(err);
				}
				console.log(result);
				return self.response_handler.renderJSON(200, result.rows);
			});

		// get latest record for device
		} else if (params.latest_record) {
			db.query("SELECT * from data WHERE device_id = $1 ORDER BY created_at DESC LIMIT 1", [params.device_id], function(err, result) {
				if (err) {
					console.log(err);
					return cb(err);
				}
				console.log(result);
				return self.response_handler.renderJSON(200, result.rows);
			});
		}
	},

	api_controller.prototype.users = function(params, cb) {
		// gets all user device info as well as user info
		/* example JSON: 
		{
		  "user": {
		        "email": "myEmail@email.com"
		  },
		  "devices": [
		        {
		            "id": 1,
		            "name": "myDevice",
		            "records": [
		                {
		                    "pH": 8,
		                    "temperature": 70,
		                    "timestamp": "10/28/15"
		                }
		            ]
		        }
		    ]
		}
		********************************
		*/
		var self = this;
		if (params.user_id) {
			db.query("SELECT id, email FROM users WHERE id = $1", [params.user_id], function(err, user_result) {
				if (err) {
					console.log(err);
					return cb(err);
				}
				db.query("SELECT * FROM devices WHERE user_id = $1", [params.user_id], function(err, devices_result) {
				if (err) {
					console.log(err);
					return cb(err);
				}

				var json = {};
				json["user"] = user_result.rows[0];
				json["devices"] = devices_result.rows;
				console.log(json);
				return self.response_handler.renderJSON(200, json);
			});	
			});	
		}  
	}

module.exports = api_controller;
