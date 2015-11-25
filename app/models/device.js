var schemas = require("../../schemas/schemas.js");
var Application = require('./application');
var db = require('../../lib/db');

var Device = function (data) {
    Application.call(this,data);
    console.log("data is " + JSON.stringify(data));
    this.data = this.sanitize(data);
    console.log("sanitized data is " + JSON.stringify(this.data));
    this.paramOrder = ['id','user_id', 'latitude', 'longitude','name','mode'];
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
    db.query('SELECT * from devices WHERE user_id=$1', [user_id], function (err, result) {
        if (err) return callback(err);
        console.log(result);
        return cb(null, result.rows);
    });   
}////

Device.prototype.save = function(callback) {  
    var self = this;
    this.data = this.sanitize(this.data);
        db.query('INSERT INTO devices (user_id, name, latitude, longitude, mode,type_of_data, keys, units) VALUES($1, $2, $3, $4, $5,$6,$7,$8) returning *', self.getSqlPostValues(), function (err, result) {
            if (err) {
                console.log(err);
                return callback(err);
            }
                return callback(null, result.rows[0]);
        });                    
}

Device.prototype.update = function(callback) {  
    var self = this;
    this.data = this.sanitize(this.data);
        db.query('UPDATE devices SET latitude=$1, longitude=$2, name=$3 WHERE id=$4 returning *', [this.data.latitude,this.data.longitude,this.data.name,this.data.id], function (err, result) {
            if (err) {
                console.log(err);
                return callback(err);
            }
                console.log("UPDATED CORRECTLY \n");
                console.log(result.rows[0]);
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
    return result;
}

Device.prototype.getSqlPostValues =  function(){
    
    var vals = [];
    vals[0] = this.data['user_id'];
    vals[1] = this.data['name'];
    vals[2] = this.data['latitude'];
    vals[3] = this.data['longitude'];
    vals[4] = this.data['mode'];
    vals[5] = this.data['type_of_data']
    // EI data parameters
    var data_param_size = Object.keys(this.data['data']).length;
    var data_param_keys = '{';
    var data_param_values = '{';
    var count = 1;
    
    for(var attr in this.data['data']){
        data_param_keys += attr;
        data_param_values += this.data['data'][attr];
        
        if(count < data_param_size){
            data_param_keys += ',';
            data_param_values += ',';
            count++;
        }
    }
    
    data_param_keys += '}';
    data_param_values += '}';
    
    vals[6] = data_param_keys;
    vals[7] = data_param_values;
    
    return vals;
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