/** user.js **/
var schemas = require("./schemas.js");  

var User = function (data) {  
    this.data = this.sanitize(data);
}

User.prototype.data = {}

User.prototype.changeName = function (name) {  
    this.data.name = name;
}

User.findById = function (id, callback) {  
    db.query('SELECT * from users WHERE id=$1', [id], function (err, result) {
        if (err) return callback(err);
        callback(null, new User(result));
    });
}

User.prototype.save = function (callback) {  
    var self = this;
    this.data = this.sanitize(this.data);

    db.query('users', {id: this.data.id}).update(JSON.stringify(this.data)).run(function (err, result) {
        if (err) return callback(err);
        callback(null, self); 
    });
}

User.prototype.get = function (name) {  
    return this.data[name];
}

User.prototype.set = function (name, value) {  
    this.data[name] = value;
}

User.prototype.sanitize = function (data) {  
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