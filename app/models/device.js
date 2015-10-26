var schemas = require("../../schemas/schemas.js");

var Device = function (data) {
	this.data = this.sanitize(data);
}

Device.prototype.data = {}

Device.findById = function(id, callback) {  
    db.query('SELECT * from devices WHERE user_id=$1', [id], function (err, result) {
        if (err) return callback(err);
        callback(null, new Device(result));
    });
}

Device.prototype.save = function(callback) {  
    var self = this;
    this.data = this.sanitize(this.data);
   			db.query('INSERT INTO devices VALUES($1, $2)', this.getDataInArrayFormat(), function (err, result) {
   			    if (err) return callback(err);
   			    callback(null, self); 
   			});
}

Device.prototype.getDataInArrayFormat = function() {
	result = []
	for (attr in this.data) {
		result.push(attr);
	}
	return result;
}

Device.prototype.get = function(name) {  
    return this.data[name];
}

Device.prototype.set = function(name, value) {  
    this.data[name] = value;
}

Device.prototype.sanitize = function(data) {  
    data = data || {};
    schema = schemas.Device;
    sanitized_data = {};
    
    for (attr in data) {
    	if (schemas[attr]) {
    		sanitized_data[attr] = data[attr];
    	}
    }
    return sanitized_data;
}

module.exports = Device;