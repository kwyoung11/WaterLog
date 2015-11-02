var schemas = require("../../schemas/schemas.js");
var crypto = require('crypto');
var bcrypt = require('bcrypt');
var Application = require('./application');
var db = require('../../lib/db');


// constructor
// params are all the params posted with the request
var Data = function (params) {  
    Application.call(this, params);

    // remove unallowed parameters
    this.params = this.sanitize(params);
}

var schema = schemas.data;

Data.prototype = Object.create(Application.prototype);
Data.prototype.constructor = Data;

Data.prototype.params = {};

Data.prototype.postToDatabase = function(cb) {

	
	 var callback = (typeof callback === 'function') ? callback : function() {};
	 var errors = {'err': false};
	 
	 var err = this.enforceRequiredParameters();
	 if(typeof err != 'undefined' && err != null){
		 cb(err);
		 return;
	 }
	 
	 db.query('INSERT INTO Data (device_id, data_type, created_at, keys, values) VALUES($1, $2, $3, $4, $5)', this.getSqlPostValues(), function (err, result) {
        if (err) {
            console.log(err);
            return cb(err);  
        } 
    });
	 
	 
	 cb('Post successful');
	 
	 
}

Data.prototype.getSqlPostValues =  function(){
	
	var vals = [];
	vals[0] = this.params['device_id'];
	vals[1] = this.params['data_type']
	vals[2] = this.params['created_at']
	
	
	// EI data parameters
	var data_param_size = Object.keys(this.params['data']).length;
	var data_param_keys = '{';
	var data_param_values = '{';
	var count = 1;
	
	for(var attr in this.params['data']){
		data_param_keys += attr;
		data_param_values += this.params['data'][attr];
		
		if(count < data_param_size){
			data_param_keys += ',';
			data_param_values += ',';
			count++;
		}
	}
	
	data_param_keys += '}';
	data_param_values += '}';
	
	vals[3] = data_param_keys;
	vals[4] = data_param_values;
	
	return vals;
}

Data.prototype.sanitize = function(params) {  
    params = params || {};
    var sanitized_data = {};
    // loop over the params hash
	var ei_data = {};
	var ei_params = this.get_ei_params(params);
	
    for (var attr in params) {
       
     // if the key in the data hash exists in the user schema hash
     if (typeof schema[attr] != 'undefined') {
      // then add it to the sanitized_data hash
      sanitized_data[attr] = params[attr];
     }
	 
	 // if the key is a key that is unique to a specific data type - water, air, soil, etc
	 // then add it to the ei params
	 if(typeof ei_params[attr] != 'undefined'){
		 ei_data[attr] = params[attr];
	 }
    }
	;
	if(Object.keys(ei_data).length > 0){
		sanitized_data['data'] = ei_data;
	}
	
	//checking time stamp
	if(typeof sanitized_data['created_at'] == 'undefined'){
		var date = new Date();
		sanitized_data['created_at'] = date.toLocaleString();
	}
	
    return sanitized_data;
}

Data.prototype.get_ei_params = function(data){
	if(data.data_type == 'water'){
		return schema['data_params']['water'];
	}
	else if(data.data_type == 'soil'){
		return schema['data_params']['soil'];
	}
	else if(data.data_type == 'air'){
		return schema['data_params']['air'];
	}
	return {};
}

// used to pass back validation errors - required fields not provided, etc
Data.prototype.enforceRequiredParameters = function(){
	var data_type = this.params['data_type'];
	var number_of_data_types = Object.keys(schema['data_params']).length;
	
	if(typeof data_type == 'undefined' || typeof schema['data_params'][data_type] == 'undefined'){
		var err = 'Error: data_type must be one of the following: ';
		var count = 1;
		for(var dataType in schema['data_params']){
			err = err + dataType;
			if(count < number_of_data_types){
				err = err + ', ';
			}
			count++;
		}
		return err;
	}
	
	for(var attr in schema){
		if(schema[attr] == 1 && typeof this.params[attr] == 'undefined'){
			return "Error: " + attr + ' is required';
		}
	}
	
	if(typeof this.params['data'] == 'undefined' || Object.keys(this.params['data']).length <= 0){
		return "Error: No Environmental Indicator data values have been provided."
	}
}

module.exports = Data;