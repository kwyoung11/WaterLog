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
var Data = require('../models/data');
var Device = require('../models/device');

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
		var self = this;
		var callback = (typeof callback === 'function') ? callback : function() {};
		// get devices for current user
		if(this.current_user != null && this.current_user.data != null && this.current_user.data.id != null){
			db.query('SELECT id FROM devices WHERE user_id = $1 AND mode = $2', [this.current_user.data.id, 'Manual'], function(err, result){
				var devicesArr = [];
				for(var row in result.rows){
					var rowId = result.rows[row].id;
					var item = {id: rowId};
					devicesArr[row] = item;
				}
				params['devices'] = devicesArr;
				view.renderView('mobile/input', params, function(data) {
				  callback(data);
				});
			});
		}
	},

	create: function(params, callback) {
		var self = this;
		
		var mobile = new Mobile(params);
		
		params = mobile.data;
		var data = new Data(params);
		data.addCustomfields();
		data.postToDatabase(function(err, result) {
			if(err){
				console.log(err);
				self.view_data.notice = "Error posting data.";
				self.response_handler.redirectTo('/mobile/input');
			}else{	
				self.view_data.notice = 'Data post successful.';
				self.response_handler.redirectTo('/mobile/input');	
			}
		});
	}
}

module.exports = mobile_controller;