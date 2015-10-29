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

/ prototype properties /

Data.prototype.params = {};
Data.prototype.paramOrder = [];

Data.prototype.postToDatabase = function(cb) {

	 var callback = (typeof callback === 'function') ? callback : function() {};
	 var errors = {'err': false};
	 
	 this.enforceRequiredParameters(function(err){
		 console.log(err);
		 return;
	 });
	 
	 var sqlPost = 'INSERT INTO ';
	 var columns = 'Data (';
	 var values = ' VALUES (';
	 var size = Object.keys(this.params).length;
	 var counter = 1;
	 for(key in this.params){
	  columns += key;
	  values += this.params[key]
	  if(counter < size){
	   columns += ', ';
	   values += ', ';
	  }
	  counter++;
	 }
	 
	 columns += ')';
	 values += ')';
	 sqlPost += columns + values + ';';
	 
	 
	 console.log('sql post is ' + sqlPost);
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

Data.prototype.enforceRequiredParameters = function(cb){
	for(var attr in schema){
		if(schema[attr] == 1 && typeof this.params[attr] == 'undefined'){
			cb(attr + ' is required');
		}
	}
}


module.exports = Data;