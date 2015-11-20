/** user.js **/
var schemas = require("../../schemas/schemas.js");
var crypto = require('crypto');
var Application = require('./application');
var db = require('../../lib/db');
var util = require('../../lib/util');

// constructor
// @data is the params hash (e-mail and password)
var Invitation = function (data) {
    Application.call(this, data);

    // remove unallowed parameters
    this.data = this.sanitize(data);
    this.paramOrder = ['user_id', 'token', 'recipient_email'];
}

Invitation.prototype = Object.create(Application.prototype);
Invitation.prototype.constructor = Invitation;
/* prototype properties */
Invitation.prototype.data = {};
Invitation.prototype.paramOrder = [];

/* prototype methods */

// save the invitation object to the database
Invitation.prototype.save = function(cb) {
    var invitation = this;

    // create the invitation token 
    var token = crypto.randomBytes(64).toString('hex');
    invitation.data.token = token;

    
    // insert invitation into database
    db.query('INSERT INTO invitations (user_id, token, recipient_email) VALUES($1, $2, $3) returning *', invitation.getDataInArrayFormat(), function (err, result) {
        if (err) return cb(err);
        cb(null, result.rows[0]);
    });   
}

// return user data hash as ordered array of values
Invitation.prototype.getDataInArrayFormat = function() {
	result = [];
    console.log(this.data);
	for (var attr in this.data) {
        var index = this.paramOrder.indexOf(attr);
		result[index] = this.data[attr];
	}
    console.log(result);
	return result;
}

// removes unallowed parameters from the parameters hash
Invitation.prototype.sanitize = function(data) {  
    data = data || {};
    schema = schemas.user;
    sanitized_data = {};
    // loop over the data hash
    for (var attr in data) {
       
        // if the key in the data hash exists in the user schema hash
    	if (schema[attr] == null) {
            // then add it to the sanitized_data hash
    		sanitized_data[attr] = data[attr];
    	}
    }
    return sanitized_data;
}

module.exports = Invitation;