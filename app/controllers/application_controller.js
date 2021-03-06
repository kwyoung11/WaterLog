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
	self.view_data.notice = GLOBAL.flash.notice;
	User.find('auth_token', util.parseCookies(self.req).envirohub_auth_token, function(err, user) {
		if (user) {
			self.current_user = user;
			self.view_data.current_user = user;
		}

		return cb();
	});
};

application_controller.prototype = {
	
	before_filter: function(action, params, cb) {
		cb(null, null);
	}
}

module.exports = application_controller;
