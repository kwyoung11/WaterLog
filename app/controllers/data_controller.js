/* 
* This controller will handle everything related to data management.
*/
var view = require('../../lib/view');
var db = require('../../lib/db');
var crypto = require('crypto');
var util = require('../../lib/util');
var Data = require('../models/data');

/* constructor */
var data_controller = function(response_handler, req, cb) {
	cb();
};

data_controller.prototype = {

	// POST /data/new
	new: function(params, callback) {
		var data_model = new Data(params);
		callback();
	}

};

module.exports = data_controller;