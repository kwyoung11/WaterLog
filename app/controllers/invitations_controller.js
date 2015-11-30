/* 
* This controller will handle everything related to user management.
*/
var view = require('../../lib/view');
var db = require('../../lib/db');
var crypto = require('crypto');
var util = require('../../lib/util');
var User = require('../models/user');
var Device = require('../models/device');
var Invitation = require('../models/invitation'); 
var application_controller = require('./application_controller');
var mailer = require('../../lib/mailer');

/* constructor */
var invitations_controller = function(response_handler, req, cb) {
	var self = this;
	application_controller.call(this, response_handler, req, function() {
		self.response_handler = response_handler;
		self.req = req;
		cb();
	});
};
// inherit properties and methods from application_controller
invitations_controller.prototype = Object.create(application_controller.prototype);
invitations_controller.prototype.constructor = invitations_controller;

/* invitations_controller prototype methods below */
	
	// GET /invitations/new
	invitations_controller.prototype.new = function(params, callback) {
		var callback = (typeof callback === 'function') ? callback : function() {};
		console.log("SELF IS: ");
		console.log(this);
		// respond with 
		view.renderView('invitations/new', this.view_data, function(data) {
		  callback(data);
		});
	},

	// POST /invitations
	invitations_controller.prototype.create = function(params, callback) {
		var self = this;
		// create new user object, passing in the email and password_digest from the post data as params
    var invitation = new Invitation(params); 
    invitation.save(function(err, invitation) { // store user info in database

			if (err) { // re-render new page, displaying any errors
				if (err.code == '23505') { // code 23505 is a unique constraint violation
					var errors = {'err': true, 'err_msg': 'That e-mail is already registered. Please choose another e-mail'};
					view.renderView('users/new', errors, function(data) {
			  		return callback(data);
					});					
				} else { // there was an error, but we're not sure what it was exactly
					var errors = {'err': true, 'err_msg': 'Something went wrong. Please contact us at support@envirohub.com for help.'};
					view.renderView('users/new', errors, function(data) {
			  		return callback(data);
					});					
				}
			}

			if (invitation) {
				// the invitations was saved, send it
				var body = "Hey there," +
					"<p>" + self.current_user.data.email + " invited you to join his private EnviroHub server. If you would like to join, you can do so by clicking the following link: </p>" +
					"<p><a href=\"https://127.0.0.1:3000/users/new/" + invitation.token + "\">Click here to register on " + self.current_user.data.email + "'s private EnviroHub server</a></p>" +
					"<p> If you do not recognize the above email, you can safely ignore this email.<p>" +
					"<p> EnviroHub</p>";
				mailer.deliver(invitation.recipient_email, "EnviroHub: " + self.current_user.data.email + " invited you to join his private EnviroHub server", body);

				// self.response_handler.setCookie('envirohub_auth_token', user.auth_token);
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
				GLOBAL.flash.notice = "Invitation sent succesfully";
				console.log(invitation);
				self.response_handler.redirectTo('users/' + invitation.user_id);
			} 
			
			
    });
    	    
		// console.log("Params are: " + JSON.stringify(params));
		// var data = null;
		// view.renderView('users/show', data, function(data) {
		// 	callback(data, user);
		// });	
	}

module.exports = invitations_controller;