/* 
* This controller will handle everything related to data management.
*/

var view = require('../../lib/view');
var db = require('../../lib/db');
var crypto = require('crypto');
var util = require('../../lib/util');
var Data = require('../models/data');
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
// inherit properties and methods from application_controller
data_controller.prototype = Object.create(application_controller.prototype);
data_controller.prototype.constructor = data_controller;

data_controller.prototype = {

	// POST /data/new
	new: function(params, callback){
		var data_model = new Data(params);
		data_model.postToDatabase(function(err){ 
			
		});
	}

};

module.exports = data_controller;