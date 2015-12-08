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
var mailer = require('../../lib/mailer');

/* constructor */
var users_controller = function(response_handler, req, cb) {
	var self = this;
	application_controller.call(this, response_handler, req, function() {
		self.response_handler = response_handler;
		self.req = req;
		cb();
	});
};
// inherit properties and methods from application_controller
users_controller.prototype = Object.create(application_controller.prototype);
users_controller.prototype.constructor = users_controller;

/* users_controller prototype methods below */
	
users_controller.prototype.before_filter = function (action, params, cb) {
	var self = this;
	if (action == "edit" || action == "update" || action == "destroy") {
		if (self.current_user.data.id != params['id']) {
			cb([403, "You do not have permission to perform this action."]);
		} else {
			cb(null);
		}
	} else if (action == "show") {
		User.findById(params['id'], function(err, user) {
				if (user && user.data.is_admin && user.data.private_profile && self.current_user.data.id != params['id']) {
					cb([403, "This user has set their profile to private."]); 
				} else if (!user.data.id) {
					cb([404, "Could not find a user with that ID."]);
				} else {
					cb(null);
				}
		});
	} else {
    cb(null);
	}
},

// GET /users/new
users_controller.prototype.new = function(params, callback) {
	var callback = (typeof callback === 'function') ? callback : function() {};
	// respond with login/registration page
	view.renderView('users/new', this.view_data, function(data) {
	  callback(data);
	});
},

// GET /users/1
users_controller.prototype.show = function(params, callback) {
	var self = this;
	var callback = (typeof callback === 'function') ? callback : function() {};
	// load user data here
	Device.findByUser(params['id'], function(err, devices) {
		
		var deviceIds = [];
		var str = "";
		for(var device in devices){
			deviceIds.push(devices[device].id);
			str += devices[device].id + ', '
		}
		
		var pos = str.lastIndexOf(',');
		str = str.substring(0,pos);
		
		var now = new Date();
		var thirtyMinutesAgo = addMinutes(now, -30);
		
		if(deviceIds.length == 0){
			deviceIds.push(-1);
		}
		
		var queryData = 'SELECT id, device_id from data WHERE';
		if(deviceIds.length > 0){
			queryData += ' device_id IN (' + deviceIds.toString() + ') AND';
		}
		queryData += ' collected_at > to_timestamp($1)';
		db.query(queryData,
			[Math.floor(thirtyMinutesAgo.getTime()/1000)], 
			function(err, data_result){
				if(err){
					return callback(err)
				}
				else{
					
					// flag all inactive and active devices for display on the SHOW page
					for(var row1 in devices){
						var device = devices[row1]
						var wirelessDevice = device.wireless_device;
						var recentData = false;
						for(var row2 in data_result.rows){
							var data = data_result.rows[row2];
							if(data.device_id == device.id && wirelessDevice){
								device.activeWirelessDevice = true;
								recentData = true;
							}
						}
						if(wirelessDevice && !recentData){
							device.inactiveWirelessDevice = true;
						}
					}
					
					var devices_obj = {'devices': []};
					devices.forEach(function(obj) {
						devices_obj['devices'].push(obj);
					});
					util.merge(self.view_data, devices_obj);
					view.renderView('users/show', self.view_data, function(content) {
					  callback(content);
					});
				}
			}
		);
		
		
	});
	
},

// GET /users/1/edit
users_controller.prototype.edit = function(params, callback) {
	var self = this;
	var user = User.findById(params['id'], function(err, user) {
		if (user.data.is_admin) { 
			self.view_data.admin = true;
		}
		console.log("HELLLLLLLLOOOOOOO");
		console.log(self.view_data);
		view.renderView('users/edit', self.view_data, function(data) {
			return callback(data);
		});	
	});
	
},

// POST /users
users_controller.prototype.create = function(params, callback) {
	var self = this;
	// create new user object, passing in the email and password_digest from the post data as params
  var user = new User(params); 
  User.find('is_admin', true, function (err, admin_user) {
  	if (!admin_user.data.invites_active || (admin_user.data.invites_active && params['invitation_token'] != 'undefined')) {
  		user.save(function(err, user) { // store user info in database

				if (err) { // re-render login page, displaying any login errors
					if (err.code == '23505') { // code 23505 is a unique constraint violation
						var errors = {'err_code': 15, 'err_msg': 'That e-mail is already registered. Please choose another e-mail'};
						
						if (self.response_handler.format == 'json') {
							self.response_handler.renderJSON(200, errors);
						} else {
							view.renderView('users/new', errors, function(data) {
				  			return callback(data);
							});						
						}
						
					} else { // there was an error, but we're not sure what it was exactly
						var errors = {'err_code': 99, 'err_msg': 'Something went wrong. Please contact us at support@envirohub.com for help.'};
						if (self.response_handler.format == 'json') {
							self.response_handler.renderJSON(200, errors);
						} else {
							view.renderView('users/new', errors, function(data) {
				  			return callback(data);
							});					
						}
						
					}
				}
	
				if (user) {
					// the user is registered, send verification email
					var body = "Hey there," +
						"<p>Welcome to EnviroHub. Please verify your e-mail by clicking on the following link: </p>" +
						"<p><a href=\"https://127.0.0.1:3000/users/confirm_email/" + user.email_confirmation_token + "\">Click here to verify your e-mail</a></p>" +
						"<p> If you did not register for EnviroHub, please ignore this e-mail.<p>" +
						"<p> EnviroHub</p>";
					mailer.deliver(user.email, "EnviroHub: Verify your e-mail", body);
	
					self.response_handler.setCookie('envirohub_auth_token', user.auth_token);
					// GLOBAL.flash.notice = 'Welcome to EnviroHub.com. Below are some steps new users may wish to do. ' +
					// 'If you are an EnviroHub device owner: <ol> <li> Register your Device with the Device ID provided to you </li> ' +
					// '<li> Verify the Device\'s status light is green <li> ' +
					// '<li> Once the status light is green, your Device is succesfully collecting data </li> ' +
					// '</ol> If you are a third-party Device owner: <ol> ' +
					// '<li> Register your Device </li> <li> Configure your Device with the Device ID given upon registration </li> ' +
					// '<li> Verify green light status for that Device on EnviroHub.com </li> </ol>' + 
					// 'If you wish to research EI data:' +
					// '<ol> <li> Explore the Map Display to find data in areas of interest </li>' + 
					// '<li> Click through to a specific Device to view all of that Device\'s data </li> ' +
					// '<li> Compare Device data with weather data and other Device data </li> </ol>';
					// redirect to users#show
					if (self.response_handler.format == 'json') {
						self.response_handler.renderJSON(200, {'msg': 'Success'});
					} else {
						self.response_handler.redirectTo('users/' + user.id);	
					}
					
				} 
		
  		});
  	} else {
  		if (self.response_handler.format == 'json') {
				self.response_handler.renderJSON(200, {'err_code': 13, 'err_msg': 'Sorry, you need to be invited to register'});
			} else {
				GLOBAL.flash.notice = "Sorry, you need to be invited to register.";
  			self.response_handler.redirectTo('/login');	
			}
  		
  	}
  });
},

// PATCH/PUT /users/1
users_controller.prototype.update = function(params, callback) {
	var self = this;
	var user = User.findById(params['id'], function(err, user) {
		if (params['email'] != user.data.email) { // user changed their e-mail
			// generate new confirmation token
			
		}
		user.update(params, function(err, user) {
			if (err) {
				if (self.response_handler.format == 'json') {
					self.response_handler.renderJSON(200, {'err_code': 12, 'err_msg': 'Update failed. Please contact envirohubapp@gmail.com for support.'});
				} else {
					GLOBAL.flash.notice = "Update failed. Please contact envirohubapp@gmail.com for support.";
					self.response_handler.redirectTo('/users/' + user.data.id);			
				}
			}

			if (user) {
				if (self.response_handler.format == 'json') {
					self.response_handler.renderJSON(200, {'msg': 'Updated successfully'});
				} else {
					GLOBAL.flash.notice = "Update successfully";
					self.response_handler.redirectTo('/users/' + user.data.id);
				}
				
			}
		});
	});
},

// GET /users/1/destroy
users_controller.prototype.destroy = function(params, callback) {
	var self = this;
		if (self.current_user.data.id == params['id']) {
			//User.findById(params['id'], function(err, user) {
				self.current_user.destroy(self.current_user.data.id,function(err, result){
				if (err) {
					var data = {'err_code': 99, 'err_msg': 'There was an error in trying to delete your records from our database.'};	
					if (self.response_handler.format == 'json') {
						self.response_handler.renderJSON(200, data);
					} else {
						view.renderView("/users/" + self.current_user.data.id, data, function(data) {
							callback(data);
						});	
					}	
				}else{

				if (self.response_handler.format == 'json') {
					var data = {'msg': 'You have been removed/deleted from our records.'};
					self.response_handler.renderJSON(200, data);
				} else {
					GLOBAL.flash.notice = 'You have been removed/deleted from our records.';
					self.response_handler.redirectTo("/#");
					
				}
				}

			});
		} else {
			var data = {'err_code': 10, 'err_msg': 'Sorry, but you don\'t have permission to do that.'};
			if (self.response_handler.format == 'json') {
				self.response_handler.renderJSON(200, data);
			} else {
				view.renderView("/users/" + self.current_user.data.id, data, function(data) {
					callback(data);
				});	
			}

			
		}
},

users_controller.prototype.confirm_email = function(params, callback) {
	var self = this;
	// find the user by the confirmation code
	User.find('email_confirmation_token', params['email_confirmation_token'], function(err, user) {
		if (user) {
			user.update({'email_confirmation_token': null, 'email_confirmed': true}, function(err, updated_user) {
				if (updated_user) {
					if (self.response_handler.format == 'json') {
						var data = {'msg': 'Email verification succesful. You can now login to EnviroHub.'};
					  self.response_handler.renderJSON(200, data);
					} else {
						GLOBAL.flash.notice = "Email verification succesful. You can now login to EnviroHub.";
						self.response_handler.redirectTo('/login');			
					}
					
				} else {
					if (self.response_handler.format == 'json') {
						var data = {'err_code': 16, 'err_msg': 'Email verification failed.'};
					  self.response_handler.renderJSON(200, data);
					} else {
						GLOBAL.flash.notice = "Email verification failed.";
						self.response_handler.redirectTo('/login');		
					}
					
				}
			});
			
		} else {
			if (self.response_handler.format == 'json') {
				var data = {'err_code': 17, 'err_msg': "Email verification failed. The e-mail confirmation token you used was invalid."};
			  self.response_handler.renderJSON(200, data);
			} else {
				GLOBAL.flash.notice = "Email verification failed. The e-mail confirmation token you used was invalid. ";
				self.response_handler.redirectTo('/login');			
			}
			
		}
	});
}

function addMinutes(date, minutes) {
	return new Date(date.getTime() + minutes*60000);
}

module.exports = users_controller;
