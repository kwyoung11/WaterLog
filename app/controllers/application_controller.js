/* 
This controller is the base controller for all other controllers.
*/

var view = require('../../lib/view');
var User = require('../models/user');
var util = require('../../lib/util');
var application_controller = function(response_handler, req, cb) {
	var self = this;
	self.response_handler = response_handler;
	self.req = req;
	self.current_user = undefined;
	self.view_data = {'err': false, 'current_user': false};
	User.find('auth_token', util.parseCookies(self.req).envirohub_auth_token, function(err, user) {

		if (user) {
			self.current_user = user;
			self.view_data.current_user = user;
		}

		cb();
	});
};

module.exports = application_controller;