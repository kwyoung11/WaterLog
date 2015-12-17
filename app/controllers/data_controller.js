/* 
* This controller will handle everything related to data management.
*/

var view = require('../../lib/view');
var db = require('../../lib/db');
var crypto = require('crypto');
var util = require('../../lib/util');
var Data = require('../models/data');
var application_controller = require('./application_controller');
var fs = require('fs');

/* constructor */
var data_controller = function(response_handler, req, cb) {
	this.response_handler = response_handler;
	this.req = req;
	setTimeout(cb, 0);
};

data_controller.prototype = Object.create(application_controller.prototype);
data_controller.prototype.constructor = data_controller;

data_controller.prototype.new = function(params, callback) {
	var self = this;
	var data_model = new Data(params);
	fs.appendFile("./logs/log.txt", JSON.stringify(data_model) + "\n\n", function(err) {
		if (err) throw err;
	});

	data_model.postToDatabase(function(err, result) {
		if (err != null) {
			var myJson = JSON.stringify(err);
			self.response_handler.renderJSON(myJson, myJson);
		} else {
			var myJson = JSON.stringify(result);
			self.response_handler.renderJSON(myJson, myJson);
		}
	});
};

module.exports = data_controller;
