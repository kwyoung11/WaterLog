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
	this.response_handler = response_handler;
	this.req = req;
};

data_controller.prototype.new = function(params, callback) {
		var self = this;
		var data_model = new Data(params);
		data_model.postToDatabase(function(result){ 
			var myJson = JSON.stringify(result);
			self.response_handler.renderJSON(myJson, myJson);
		});
	};

module.exports = data_controller;
