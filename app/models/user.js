/** user.js **/
var schemas = require("../../schemas/schemas.js");
var crypto = require('crypto');
var bcrypt = require('bcrypt');

var User = function (data) {  
		// create the users authentication token, which will be stored in a cookie
    var token = crypto.randomBytes(64).toString('hex');
    data['auth_token'] = token;
    this.data = this.sanitize(data);
}

User.prototype.data = {}

User.prototype.changeName = function (name) {  
    this.data.name = name;
}

User.findById = function(id, callback) {  
    db.query('SELECT * from users WHERE id=$1', [id], function (err, result) {
        if (err) return callback(err);
        callback(null, new User(result));
    });
}

User.prototype.save = function(callback) {  
    var self = this;
    this.data = this.sanitize(this.data);

    // generate a salt, then encrypt the inputted password with that salt
    bcrypt.genSalt(10, function(err, salt) {
    	bcrypt.hash(params['password'], salt, function(err, hash) {
   			db.query('INSERT INTO users VALUES($1, $2, $3)', this.getDataInArrayFormat(), function (err, result) {
   			    if (err) return callback(err);
   			    callback(null, self); 
   			});
   		});
   	});
}

User.prototype.getDataInArrayFormat = function() {
	result = []
	for (attr in this.data) {
		result.push(attr);
	}
	return result;
}

User.prototype.get = function(name) {  
    return this.data[name];
}

User.prototype.set = function(name, value) {  
    this.data[name] = value;
}

User.prototype.sanitize = function(data) {  
    data = data || {};
    schema = schemas.user;
    sanitized_data = {};
    
    for (attr in data) {
    	if (schemas[attr]) {
    		sanitized_data[attr] = data[attr];
    	}
    }
    return sanitized_data;
}

module.exports = User;