/** user.js **/
var schemas = require("../../schemas/schemas.js");
var crypto = require('crypto');
var bcrypt = require('bcrypt');
var Application = require('./application');
var db = require('../../lib/db');
var util = require('../../lib/util');

// constructor
// @data is the params hash (e-mail and password)
var User = function (data) {
    Application.call(this, data);

    // remove unallowed parameters
    this.data = this.sanitize(data);
    this.data.password_reset_token = null;
    this.data.password_reset_sent_at = null;
	var keypair = this.generateKeyPair();
	this.data.public_key = keypair[0];
	this.data.private_key = keypair[1];
    this.paramOrder = ['email', 'password_digest', 'auth_token', 'salt', 'password_reset_token', 'password_reset_sent_at', 'public_key', 'private_key', 'email_confirmation_token', 'email_confirmed', 'is_admin', 'private_profile', 'invites_active'];
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
        cb(null, new User(result.rows[0]));
    });
}

// save the user object to the database
User.prototype.save = function(cb) {
    var user = this;

    // create the user authentication token, which will be stored in a cookie
    var token = crypto.randomBytes(64).toString('hex');
    user.data.auth_token = token;

    // set public and private keys
    user.data.public_key = null;
    user.data.private_key = null;

    // create an e-mail confimation token.
    var token = crypto.randomBytes(64).toString('hex');
    user.data.email_confirmation_token = token;
    user.data.email_confirmed = false;

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
            db.query('INSERT INTO users (email, password_digest, auth_token, salt, password_reset_token, password_reset_sent_at, public_key, private_key, email_confirmation_token, email_confirmed, is_admin, private_profile, invites_active) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) returning *', user.getDataInArrayFormat(), function (err, result) {
                if (err) return cb(err);
                cb(null, result.rows[0]);
            });
            });    
        }
    	
   	});
}

// generate a hashed password from the original
User.prototype.generatePassword = function(password_digest, cb) {
   user = this;
    bcrypt.hash(password_digest, user.data.salt, function(err, hash) {
        if (err) { 
            console.log("bcrypt hash err");
            return cb(err);
        }

        console.log("HASH is: " + hash);
        
        // insert user info into database
        db.query('UPDATE users SET password_digest = $1 WHERE id = $2 returning *', [hash, user.data.id], function (err, result) {
            if (err) return cb(err);
            cb(null, new User(result.rows[0]));
        });
    }); 
};

// update specific attributes of user object in database
User.prototype.update = function(obj, cb) {
    console.log("in user update");
    var user = this;
    var count = util.size(obj);
    var update_string = '';
    var user_id_placeholder = count + 1;

    var keys = [];
    // get values array
    var result = [];
    for (var attr in obj) {
        keys.push(attr);
        if (attr == 'password_digest') {
            user.generatePassword(obj[attr], function(err, user) {
                result.push(user.data.password_digest);
            });
        }
        result.push(obj[attr]);
    }
    result.push(user.data.id);

    // generate placeholders
    for (var i = 1; i <= keys.length; i++) {
        update_string += keys[i-1] + '=$' + i + ',';
    }
    // remove trailing comma
    update_string = update_string.substr(0, update_string.length-1);

    console.log('UPDATE users SET '+update_string+' WHERE id=$'+user_id_placeholder + ' returning *');
    console.log(result);
    db.query('UPDATE users SET '+update_string+' WHERE id=$'+user_id_placeholder + ' returning *', result, function (err, result) {
        if (err) {
            console.log("update error");
            return cb(err);  
        } 
        cb(null, new User(result.rows[0]));
    });
}

// return user data hash as ordered array of values
User.prototype.getDataInArrayFormat = function() {
	result = [];
	for (var attr in schema) {
		var index = this.paramOrder.indexOf(attr);
		result[index] = this.data[attr];
	}
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

User.prototype.generateKeyPair = function(){
	var prime_length = 60;
	var diffieHellman = crypto.createDiffieHellman(prime_length);

	diffieHellman.generateKeys('base64');
	var publicKey = diffieHellman.getPublicKey('base64');
	var privateKey = diffieHellman.getPrivateKey('base64');
	
	return [publicKey, privateKey];
}

module.exports = User;