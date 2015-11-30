var schemas = require("../../schemas/schemas.js");
var crypto = require('crypto');
var bcrypt = require('bcrypt');
var moment = require('moment');
var Application = require('./application');
var db = require('../../lib/db');
var util = require('../../lib/util');
var dataRanges = require("../../schemas/dataRanges.js");



// constructor
// params are all the params posted with the request
var Data = function (params) {  
    Application.call(this, params);
	this.params = params;
	if(typeof params.signedData != 'undefined'){
		this.encryptedData = true;
	}
}

var schema = schemas.data;

Data.prototype = Object.create(Application.prototype);
Data.prototype.constructor = Data;


Data.prototype.params = {};


Data.prototype.postToDatabase = function(cb) {
	var self = this;
	util.getDeviceAndUser(
		this.params.device_id,
		function(err){
			console.log(err);
			cb(err, null);
		},
		function(result){
			self.decrypt(
				function(err){
					console.log(err);
					cb(err, null);
				}, 
				function(){
					p=self.params
					self.sanitize(p,function(err, data){
						if(err){
							cb(err, null);
						}else{
						self.params=data;
						var device = result[0];
						self.enforceRequiredParameters(
							device,
							function(err){
								console.log(err);
								cb(err, null);
							},
							function(){
								db.query('INSERT INTO Data (device_id, data_type, created_at,collected_at, keys, values) VALUES($1, $2, $3, $4, $5, $6)', self.getSqlPostValues(), function (err, result) {
									if (err) {
										console.log(err);
										return cb(err, null);  
									}
									else{
										if(self.encryptedData == true){	
											console.log('Successful post');
											cb(null, 'Post successful');
										}
										else{
											console.log('Successful unencrypted post');
											cb(null, 'Unencrypted post successful');
										}
										
										// Update device location if necessary
										
										
										if(typeof self.params.latitude != 'undefined' && typeof self.params.longitude != 'undefined'){
											db.query('Update devices SET (latitude, longitude) = ($1, $2) where id = $3', [
												self.params.latitude, self.params.longitude, device.id],
												function(err, result){}
												);
											
										}
									}
								});
							}
						);
						}
				});////
				},
				result[1].public_key,
				result[1].shared_private_key
			);
		});
}


Data.prototype.getSqlPostValues =  function(){
	
	var vals = [];
	vals[0] = this.params['device_id'];
	vals[1] = this.params['data_type'];
	vals[2] = this.params['created_at'];
	vals[3] = this.params['collected_at'];
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
	
	vals[4] = data_param_keys;
	vals[5] = data_param_values;
	return vals;
}

Data.prototype.decrypt = function(cbErr, result, public_key, shared_private_key){
	var errorEncountered = false;
	
	if(this.encryptedData == true){
		
		// verify that the signed data could have been generated from the unsigned data
		var signedData = this.params.signedData;
		var verify = crypto.createVerify('RSA-SHA256');
		verify.update(this.params.unsignedData);
		var validSignature = verify.verify(public_key, signedData, 'hex');
		if(validSignature == true){
			
			// proceed to decrypt the unsigned data
			var algorithm = 'aes-128-cbc';
			var clearEncoding = 'utf8';
			var cipherEncoding = 'hex';
			var decipher = crypto.createDecipher(algorithm, shared_private_key);
			
			if(typeof this.params.unsignedData == 'string'){
				try{
					var unencryptedData = decipher.update(this.params.unsignedData, cipherEncoding, clearEncoding);
					unencryptedData += decipher.final();
					
					var data = unencryptedData.split('&');
					for(var i = 0 ; i < data.length; i++){
						var keyAndValue = data[i].split('=');
						var key = keyAndValue[0];
						var value = keyAndValue[1];
						this.params[key] = value;
					}
					this.params.encryptedData = null;
				}
				catch(err){
					cbErr('Error decrypting data.  You may have encrypted data with the wrong secret key or supplied the wrong device_id.');
					errorEncountered = true;
				}
			}
		}
		else{
			errorEncountered = true;
			cbErr('Error verifying signature.  Make sure you have signed in hex format.');
		}
		
	}
	
	if(errorEncountered == false){
		result();
	}
	
}

Data.prototype.sanitize = function(params,cb) {  
	var self = this;
    params = params || {};
    var sanitized_data = {};
    // loop over the params hash
	var ei_data = {};
	
	this.addCustomFieldsToSchema(
		function(err){
			
			if(err){
				
			}
			else{
				for (var attr in params) {
		   
				 // if the key in the data hash exists in the user schema hash
				 if (typeof schema[attr] != 'undefined') {
				  // then add it to the sanitized_data hash
				  sanitized_data[attr] = params[attr];
				 }
				 // else if its a custom data type, add it to a data hash
				 else if(typeof schema['custom'] != 'undefined' && typeof schema['custom'][attr] != 'undefined'){
					 if(sanitized_data['data'] == null){
						 sanitized_data['data'] = {};
					 }
					 sanitized_data['data'][attr] = params[attr];
				 }
				}
				
				//checking time stamp
				if(typeof sanitized_data['created_at'] == 'undefined'){
					var date = new Date();
					x=0;
					var x = self.checkTimeStamp(date,function(res){
						if(res == 0){
							var err = "Error: Cannot insert because of timestamp overlay";
							console.log(err);
							cb(err, null);
						}else{
							sanitized_data['created_at'] = moment(date.toLocaleString(), "MM-DD-YYYY HH:mm:ss a A");
							if(typeof sanitized_data['collected_at']=='undefined'){
								sanitized_data['collected_at'] = moment(date.toLocaleString(), "MM-DD-YYYY HH:mm:ss a A");
							}
							cb(null, sanitized_data);
						}
					});
				}
			}
		}
	
	);
	
    
}

Data.prototype.checkTimeStamp = function(t, callback) {  
    var self = this;
        	db.query('SELECT * FROM data WHERE data_type=$1 AND device_id=$2', 
            [self.params.data_type,self.params.device_id], function (err, result) {
            if(result.rows[0] == null){
            	callback(1);
            } 
			//else if(self.params){ //need to check if Arduino device }
            else{
                var x = result.rows.length;
                var most_recent = result.rows[x-1].created_at; //gets last entry
                var time2 = new Date(most_recent);
                if((t.getTime() - time2.getTime()) < 15*60*1000){
                	console.log("Error: Cannot insert because of timestamp overlap\n");
                	callback(0);
                }else{
                	callback(1);
                }
            }
        }); 
},

Data.prototype.get_custom_params = function(){
	return schema['custom'];
}


// used to pass back validation errors - required fields not provided, etc
Data.prototype.enforceRequiredParameters = function(device, cbErr, cbSuccess){
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
		cbErr(err);
	}
	else{
		for(var attr in schema){
			if(schema[attr] == 1 && typeof this.params[attr] == 'undefined'){
				console.log("Error: " + attr + ' is required');
				cbErr("Error: " + attr + ' is required');
			}
		}
		
		if((typeof this.params['latitude'] == 'undefined' || typeof this.params['longitude'] == 'undefined')
				&& (typeof device['latitude'] == 'undefined' || typeof device['longitude'] == 'undefined' )){
			cbErr('Error: No locational data has been provided');
		}
		else{
			this.validateDataTypesAndRanges(cbErr, cbSuccess);
		}
	}
},

Data.prototype.constructDataArrayForPost = function(cbErr, cbSuccess){
	
	if(typeof this.params['data'] == 'undefined' || Object.keys(this.params['data']).length <= 0){
		cbErr("Error: No Environmental Indicator data values have been provided.");
	}
	else{
		cbSuccess();
	}
	
},

Data.prototype.validateDataTypesAndRanges = function(cbErr, cbSuccess){
	var data_type = this.params['data_type'];
	var errEncountered = false;
	
	for(var param in this.params){
		var value = this.params[param];
		if(typeof dataRanges[param] != 'undefined'){
			var typeWeWant = typeof dataRanges[param]['type'];
			if(typeWeWant == 'number'){
				value = Number(value);
			}
			if(typeof value != typeof dataRanges[param]['type'] || (typeof value == 'number' && isNaN(value))){
				cbErr('Error: Parameter ' + param + ' must be of type ' + typeof dataRanges[param]['type']);
				errEncountered = true;
				break;
			}
		}
		else if(typeof dataRanges[data_type][param] != 'undefined'){
			var typeWeWant = typeof dataRanges[data_type][param]['type'];
			if(typeWeWant == 'number'){
				value = Number(value);
			}
			if(typeof value != typeof dataRanges[data_type][param]['type'] || (typeof value == 'number' && isNaN(value))){
				cbErr('Error: Parameter ' + param + ' must be of type ' + typeof dataRanges[data_type][param]['type']);
				errEncountered = true;
				break;
			}
		}
	}
	
	if(errEncountered == false){
		this.constructDataArrayForPost(cbErr, cbSuccess);
	}
},

Data.prototype.addCustomFieldsToSchema=function(callback){
	var self = this;
    curr_schema=schema;
	
	db.query('SELECT keys FROM devices WHERE id=$1', [self.params.device_id], function (err, result){
		if(err){
			callback(err);
		}else{
			
			// add custom fields from device to schema for data
			var device = result.rows[0];
			schema['custom'] = {};
			for(var key in device.keys){
				schema['custom'][device.keys[key]] = null;
			}
			
			callback(null);
		}
	});

},


module.exports = Data;
