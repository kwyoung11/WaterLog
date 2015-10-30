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
    this.paramOrder = ['TBD'];
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
	 
	 var sqlPost = 'INSERT INTO ';
	 var columns = 'Data (';
	 var values = ' VALUES (';
	 var size = Object.keys(params).length;
	 var counter = 1;
	 for(key in params){
	  columns += key;
	  values += params[key]
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
	 /*
		db.query(sqlPost, [], function (err, result) {
			if (err) return cb(err);
			cb(null, result.rows[0]);
		});
	 */
}

Data.prototype.sanitize = function(data) {  
    data = data || {};
    sanitized_data = {};
    // loop over the data hash
	ei_data = {};
	var ei_params = get_ei_params(data);
    for (var attr in data) {
       
     // if the key in the data hash exists in the user schema hash
     if (schema[attr] == null) {
      // then add it to the sanitized_data hash
      sanitized_data[attr] = data[attr];
     }
	 // if the key is a key that is unique to a specific data type - water, air, soil, etc
	 // then add it to the ei params
	 if(ei_params[attr] == null){
		 ei_data[attr] = data[attr];
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


module.exports = Data;