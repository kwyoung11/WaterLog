/** user.js **/
var schemas = require("../../schemas/schemas.js");
var crypto = require('crypto');
var bcrypt = require('bcrypt');
var Application = require('./application');

// constructor
// @data is the params hash (e-mail and password)
var User = function (data) {  
    Application.call(this, data);
	// create the user authentication token, which will be stored in a cookie
    var token = crypto.randomBytes(64).toString('hex');
    // add it to the data hash
    data['auth_token'] = token;
    console.log("data is " + JSON.stringify(data));
    // remove unallowed parameters
    this.data = this.sanitize(data);
    console.log("sanitized data is " + JSON.stringify(this.data));
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

// find user by ID and pass object instance of that user to cb
User.findById = function(id, cb) {  
    db.query('SELECT * from users WHERE id=$1', [id], function (err, result) {
        if (err) return cb(err);
        cb(null, new User(result));
    });
}

// save the user object to the database
User.prototype.save = function(cb) {  
    var self = this;
    console.log(this.data['password_digest']);
    // generate a salt, hash the inputted password along with that salt
    bcrypt.genSalt(10, function(err, salt) {
    	bcrypt.hash(self.data.password_digest, salt, function(err, hash) {
            console.log("Hash is: ");
            console.log(hash);
            console.log("Salt is: ");
            console.log(salt);
            // insert user info into database
            // $1 = email, $2 = password_digest $3 = auth_token, $4 = salt
   			// db.query('INSERT INTO users VALUES($1, $2, $3)', this.getDataInArrayFormat(), function (err, result) {
   			//     if (err) return cb(err);
   			    cb(null, self); 
   			// });
   		});
   	});
}

// return user data hash as order array of values
User.prototype.getDataInArrayFormat = function() {
	result = [];
	for (var attr in this.data) {
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
    console.log(schema);
    // loop over the data hash
    for (var attr in data) {
        console.log(attr);
        console.log(schema[attr]);
        // if the key in the data hash exists in the user schema hash
    	if (schema[attr] == null) {
            // then add it to the sanitized_data hash
    		sanitized_data[attr] = data[attr];
    	}
    }
    return sanitized_data;
}

module.exports = User;