var schemas = require("../../schemas/schemas.js");
var Application = require('./application');
var db = require('../../lib/db');

var Device = function (data) {
    Application.call(this,data);
    console.log("data is " + JSON.stringify(data));
    this.data = this.sanitize(data);
    console.log("sanitized data is " + JSON.stringify(this.data));
    this.paramOrder = ['user_id', 'name', 'latitude', 'longitude'];
}

Device.prototype = Object.create(Application.prototype);
Device.prototype.constructor = Device;
/* prototype properties */
Device.prototype.data = {};
Device.prototype.paramOrder = [];

Device.find = function(attr, val, cb) {
    db.query('SELECT * from devices WHERE '+attr+'=$1', [val], function (err, result) {
        if (err) return cb(err);
        if (result.rowCount == 0) return cb(null, undefined);
        cb(null, new Device(result.rows[0]));
    });
    
}

Device.findById = function(id, callback) {  
    db.query('SELECT * from devices WHERE id=$1', [id], function (err, result) {
        if (err) return callback(err);
        callback(null, result.rows[0]);
    });
}

Device.findByUser = function(user_id, cb) {
    console.log(user_id);
    db.query('SELECT * from devices WHERE user_id=$1', [user_id], function (err, result) {
        if (err) return callback(err);
        console.log(result);
        return cb(null, result.rows);
    });   
};

Device.prototype.save = function(callback) {  
    var self = this;
    this.data = this.sanitize(this.data);
   		db.query('INSERT INTO devices (user_id, name, latitude, longitude) VALUES($1, $2, $3, $4) returning *', self.getDataInArrayFormat(), function (err, result) {
   			if (err) {
                console.log(err);
                return callback(err);
            }
                return callback(null, result.rows[0]);
        });             
   			
}

Device.prototype.getDataInArrayFormat = function() {
	result = []
    schema = schemas.device;
	for (var attr in this.data) {
		var index = this.paramOrder.indexOf(attr);
        result.push(this.data[attr]);
	}
    console.log("PRINTING DATA IN ARRAY");
    console.log(result);
	return result;
}

Device.prototype.get = function(name) {  
    return this.data[name];
}

Device.prototype.set = function(name, value) {  
    this.data[name] = value;
}

Device.prototype.sanitize = function(data) {  
    console.log("SANITIZING DATA NOW")
    data = data || {};
    schema = schemas.device;
    sanitized_data = {};

    for (var attr in data) {
        //console.log("CURRENT ATTRIBUTE IN DATA IS "+attr);
    	if (schema[attr]==null) {
            //console.log("FOUND SCHEMA");
    		sanitized_data[attr] = data[attr];
    	}
    }
    return sanitized_data;
}

module.exports = Device;