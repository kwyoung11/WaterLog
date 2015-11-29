var schemas = require("../../schemas/schemas.js");
var Application = require('./application');
var db = require('../../lib/db');

var Device = function (data) {
    Application.call(this,data);
    console.log("data is " + JSON.stringify(data));
    this.data = this.sanitize(data);
    console.log("sanitized data is " + JSON.stringify(this.data));
    this.paramOrder = ['id','user_id', 'latitude', 'longitude','name','mode','type_of_data','keys','units'];
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
                console.log("HERE\n\n\n");
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

Device.prototype.getSqlPostValues =  function(){
    
    var vals = [];
    vals[0] = this.data['user_id'];
    vals[1] = this.data['name'];
    vals[2] = this.data['latitude'];
    vals[3] = this.data['longitude'];
    vals[4] = this.data['mode'];

    if(this.data['mode']=="Manual"){
        vals[5] = ''
        vals[6] = '{}'
        vals[7] = '{}'
    }
    else{
        vals[5] = this.data['type_of_data'];
    
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
    console.log("POST VALUES");
    console.log(vals);
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
    //sanitized_data['keys']=
    var sanitize_keys_array=[];
    var sanitize_units_array=[];
    if(data["mode"]=="Manual"){
        console.log("ITS A MOBILE DEVICE\n");
        sanitized_data["name"] = data["name"];
        sanitized_data["latitude"] = data["latitude"];
        sanitized_data["longitude"] = data["longitude"];
        sanitized_data["mode"] = data["mode"];
        sanitized_data["user_id"] = data["user_id"];

    }else{
        //sanitized_data["id"] = data["id"];
        for (var attr in data) {
            if (schema[attr]==null) {
            //console.log("FOUND SCHEMA");
                sanitized_data[attr] = data[attr];
            }else if(attr.match("keys")){ 
                var ind = 0;
                while(ind < data[attr].length){
                    //console.log(data[attr][ind]);
                    if(data[attr][ind]!=""){
                        sanitize_keys_array.push(data[attr][ind]);
                    }
                    ind++;
                }
                sanitized_data[attr] = sanitize_keys_array;
            }else if (attr.match("units")){
                var ind = 0;
                while(ind < data[attr].length){
                //console.log(data[attr][ind]);
                    if(data[attr][ind]!=""){
                        sanitize_units_array.push(data[attr][ind]);
                    }
                    ind++;
                }
                sanitized_data[attr] = sanitize_units_array;
            }
        
        }
    }
    //console.log("SANITIZED DATA");
    //console.log(sanitized_data);
    return sanitized_data;
}

module.exports = Device;