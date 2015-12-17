var schemas = require("../../schemas/schemas.js");
var Application = require('./application');
var db = require('../../lib/db');
var util = require('../../lib/util');

var Device = function (data) {
    Application.call(this,data);
    this.data = this.sanitize(data);
    console.log("sanitized data is " + JSON.stringify(this.data));
    this.paramOrder = ['id','user_id', 'latitude', 'longitude','name','mode','type_of_data','keys','units', 'ignore_post_requests'];
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
        callback(null, new Device(result.rows[0]));
    });
}

Device.findByUser = function(user_id, cb) {
    db.query('SELECT * from devices WHERE user_id=$1', [user_id], function (err, result) {
        if (err) return callback(err);
        console.log(result);
        return cb(null, result.rows);
    });   
}

Device.prototype.save = function(callback) {
    var self = this;
    if (this.data['user_id']!=undefined) {
        db.query('INSERT INTO devices (user_id, name, latitude, longitude, mode,type_of_data, keys, units, wireless_device) VALUES($1, $2, $3, $4, $5,$6,$7,$8,$9) returning *', self.getSqlPostValues(), function (err, result) {
            if (err) {
                return callback(err);                   
            }else{
               return callback(null, result.rows[0]); 
            }
        }); 
    } else {
        callback(true);
    }               
}

Device.prototype.update = function(obj, cb) {  
    console.log("in user update");
    var device = this;
    var count = util.size(obj);
    var update_string = '';
    var device_id_placeholder = count + 1;

    var keys = [];
    // get values array
    var result = [];
    console.log("IN device UPDATE");
    console.log(device);
    for (var attr in obj) {
        keys.push(attr);
        result.push(obj[attr]);
    }
    result.push(device.data.id);
    console.log(device);
    // generate placeholders
    for (var i = 1; i <= keys.length; i++) {
        update_string += keys[i-1] + '=$' + i + ',';
    }
    // remove trailing comma
    update_string = update_string.substr(0, update_string.length-1);

    console.log('UPDATE devices SET '+update_string+' WHERE id=$'+device_id_placeholder + ' returning *');
    console.log(result);
    db.query('UPDATE devices SET '+update_string+' WHERE id=$'+device_id_placeholder + ' returning *', result, function (err, result) {
        if (err) {
            console.log("update error");
            return cb(err);
        } 
        return cb(null, new Device(result.rows[0]));
    });
}

Device.prototype.getSqlPostValues =  function() {
    var vals = [];
    vals[0] = this.data['user_id'];
    vals[1] = this.data['name'];
    vals[2] = this.data['latitude'];
    vals[3] = this.data['longitude'];
    vals[4] = this.data['mode'];

    vals[5] = this.data['type_of_data'];
        if(this.data['keys']!=null){
          
            var data_param_size = this.data['keys'].length;
            console.log("param size is "+data_param_size);
            var data_param_keys = '{';
            var data_param_units = '{';
            var count = 1;
            var ind=0
            while(ind < data_param_size){
                data_param_keys += this.data['keys'][ind];
                data_param_units += this.data['units'][ind];
        
                if(count < data_param_size){
                    data_param_keys += ',';
                    data_param_units += ',';
                    count++;
                }
                ind++;
            }
    
            data_param_keys += '}';
            data_param_units += '}';
            vals[6] = data_param_keys;
            vals[7] = data_param_units;
        }
		vals[8] = this.data['wireless_device'];
    return vals;
}

Device.prototype.sanitize = function(data) {  
    data = data || {};
    schema = schemas.device;
    sanitized_data = {};
    var sanitize_keys_array=[];
    var sanitize_units_array=[];
        for (var attr in data) {
            if (schema[attr] == null) {
                sanitized_data[attr] = data[attr];
            } else if (attr.match("keys")) { 
                var ind = 0;
                var count=0;
                while (ind < data[attr].length) {
                    if (data[attr][ind]!="") {
                        count++;
                        sanitize_keys_array.push(data[attr][ind]);
                    }
                    ind++;
                }
                if (sanitize_keys_array.length == 0) {
                    console.log("No measurements specified");
                    return {};
                }
                sanitized_data[attr] = sanitize_keys_array;
            } else if (attr.match("units")) {
                var ind = 0;
                while (ind < data[attr].length) {
                    if (data[attr][ind]!="") {
                        sanitize_units_array.push(data[attr][ind]);
                    }
                    ind++;
                }
                if (sanitize_units_array.length != sanitize_keys_array.length) {
                    console.log("number of keys not equal to number of values");
                    return {};
                } else {
                    sanitized_data[attr] = sanitize_units_array;
                }
            }    
        }
    return sanitized_data;
}

module.exports = Device;
