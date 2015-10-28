/** user.js **/
var schemas = require("../../schemas/schemas.js");
var crypto = require('crypto');
var bcrypt = require('bcrypt');
var Application = require('./application');
var db = require('../../lib/db');

// constructor
// @data is the params hash (e-mail and password)
var User = function (data) {  
    Application.call(this, data);

    // remove unallowed parameters
    this.data = this.sanitize(data);
    this.paramOrder = ['email', 'password_digest', 'auth_token', 'salt'];
}

User.prototype = Object.create(Application.prototype);
User.prototype.constructor = User;
/* prototype properties */
User.prototype.data = {};
User.prototype.paramOrder = [];

/* prototype methods */
User.prototype.changeName = function (name) {  
    this.data.name = name;
}

User.prototype.authenticate = function(pwd, cb) {
    var self = this;

    bcrypt.hash(pwd, self.data.salt, function(err, hash) {
        
        if (err) {
            console.log(err);
            return cb(err, false);  
        } 

        if (hash != self.data.password_digest) {
            return cb(null, false);
        } else {
            cb(null, true);
        }

    });
}

User.find = function(attr, val, cb) {
    db.query('SELECT * from users WHERE '+attr+'=$1', [val], function (err, result) {
        if (err) {
            console.log(err);
            return cb(err);  
        } 
        if (result.rowCount == 0) {
            console.log("No user found with " + attr + " = to " + val);
            return cb(null, undefined);  
        } 
        cb(null, new User(result.rows[0]));
    });
    
}
// find user by ID and pass object instance of that user to cb
User.findById = function(id, cb) {  
    db.query('SELECT * from users WHERE id=$1', [id], function (err, result) {
        if (err) return cb(err);
        cb(null, result.rows[0]);
    });
    // var user = new User({'id': 1, 'email': 'kyoung18@umd.edu'});
    // cb(null, user.data);
}

// save the user object to the database
User.prototype.save = function(cb) {  
    var user = this;

    // create the user authentication token, which will be stored in a cookie
    var token = crypto.randomBytes(64).toString('hex');
    user.data.auth_token = token;

    // generate a salt 
    bcrypt.genSalt(10, function(err, salt) {
        if (err) console.log("salt err");
        user.data.salt = salt;

        console.log("SALT is: " + salt);
        // hash the user password with the salt
        if (user.data.password_digest && salt) {
            bcrypt.hash(user.data.password_digest, salt, function(err, hash) {
            if (err) { 
                console.log("bcrypt hash err");
                return cb(err);
            }

            console.log("HASH is: " + hash);
            
            user.data.password_digest = hash;

            // insert user info into database
            db.query('INSERT INTO users (email, password_digest, auth_token, salt) VALUES($1, $2, $3, $4) returning *', user.getDataInArrayFormat(), function (err, result) {
                if (err) return cb(err);
                cb(null, result.rows[0]);
            });
            });    
        }
    	
   	});
}

// return user data hash as ordered array of values
User.prototype.getDataInArrayFormat = function() {
	result = [];
    console.log(this.data);
	for (var attr in this.data) {
        var index = this.paramOrder.indexOf(attr);
		result[index] = this.data[attr];
	}
    console.log(result);
	return result;
}

User.prototype.get = function(name) {  
    return this.data[name];
}

User.prototype.set = function(name, value) {  
    this.data[name] = value;
}

// removes unallowed parameters from the parameters hash
User.prototype.sanitize = function(data) {  
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

module.exports = User;