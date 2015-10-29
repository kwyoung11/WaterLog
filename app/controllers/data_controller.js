/* 
* This controller will handle everything related to data management.
*/
var view = require('../../lib/view');
var db = require('../../lib/db');
var crypto = require('crypto');
var util = require('../../lib/util');
var User = require('../models/user');
var application_controller = require('./application_controller');

/* constructor */
var data_controller = function(response_handler, req, cb) {
	var self = this;
	application_controller.call(this, response_handler, req, function() {
		self.response_handler = response_handler;
		self.req = req;
		cb();
	});
};

data_controller.prototype = Object.create(application_controller.prototype);
data_controller.prototype.constructor = data_controller;

data_controller.prototype = {

	// POST /data/new
	new: function(params, callback) {
		
		var sqlPost = 'INSERT INTO ';
		var columns = 'Data (';
		var values = ' VALUES (';
		var size = Object.keys(params).length;
		var counter = 1;
		for(key in params){
			columns += key;
			values += params[key]
			if(counter < size){
				columns += ', ';
				values += ', ';
			}
			counter++;
		}
		columns += ')';
		values += ')';
		sqlPost += columns + values + ';';
		callback();
	}



};

module.exports = data_controller;