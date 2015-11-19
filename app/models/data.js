var schemas = require("../../schemas/schemas.js");
var crypto = require('crypto');
var bcrypt = require('bcrypt');
var Application = require('./application');
var db = require('../../lib/db');
var util = require('../../lib/util');


// constructor
// params are all the params posted with the request
var Data = function (params) {  
    Application.call(this, params);
	this.params = params;
	if(typeof params.encryptedData != 'undefined'){
		this.encryptedData = true;
	}
}

var schema = schemas.data;

Data.prototype = Object.create(Application.prototype);
Data.prototype.constructor = Data;


Data.prototype.params = {};

Data.prototype.encryptData = function(cb){
	var self = this;
	if(typeof this.params.device_id != 'undefined' && this.params.device_id != null){
		
		var deviceAndUser = util.getDeviceAndUser(this.params.device_id, 
			function(err){
				
			},
			function(deviceAndUser){
				var stringToEncrypt = '';
				for(var attr in self.params){
					stringToEncrypt += attr + '=' + self.params[attr] + '&';
				}
				var device_id = self.params.device_id;
				self.params = {};
				self.params.device_id = device_id;
				self.params.encryptedData = util.encrypt(deviceAndUser[1].private_key, stringToEncrypt);
				self.encryptedData = true;
				cb();
			}
		);
	}
}

Data.prototype.postToDatabase = function(cb) {
	var self = this;
	util.getDeviceAndUser(
		this.params.device_id,
		function(err){
			console.log(err);
			cb(err);
		},
		function(result){
			self.decrypt(
				function(err){
					console.log(err);
					cb(err);
				}, 
				function(){
					p=self.params
					self.sanitize(p,function(data){
						self.params=data;
					var device = result[0];
					self.enforceRequiredParameters(
						device,
						function(err){
							console.log(err);
							cb(err);
						},
						function(){
							db.query('INSERT INTO Data (device_id, data_type, created_at, keys, values) VALUES($1, $2, $3, $4,$5)', self.getSqlPostValues(), function (err, result) {
								if (err) {
									console.log(err);
									return cb(err);  
								}
								else{
									if(self.encryptedData == true){	
										console.log('Successful post');
										cb('Post successful');
									}
									else{
										console.log('Successful unencrypted post');
										cb('Unencrypted post successful');
									}
								}
							});
						}
					);
				});////
				},
				result[1].private_key
			);
		});
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

Data.prototype.decrypt = function(cb, result, private_key){
	var errorEncountered = false;
	
	if(this.encryptedData == true){
		var encryptedData = this.params.encryptedData;
		var algorithm = 'aes-128-cbc';
		var clearEncoding = 'utf8';
		var cipherEncoding = 'hex';
		var decipher = crypto.createDecipher(algorithm, private_key);
		
		if(typeof encryptedData == 'string'){
			try{
				var unencryptedData = decipher.update(encryptedData, cipherEncoding, clearEncoding);
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
				cb('Error decrypting data.  You may have encrypted data with the wrong secret key or supplied the wrong device_id.');
				errorEncountered = true;
			}
		}
	}
	
	if(errorEncountered == false){
		result();
	}
	
}

Data.prototype.sanitize = function(params,cb) {  

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
		x=0;
		var x = this.checkTimeStamp(date,function(res){
			if(res == 0){
				console.log("cannot input\n");
				cb({});
			}else{
				sanitized_data['created_at'] = date.toLocaleString();
				cb(sanitized_data);
			}
		});/////
		//console.log(x);
		//	sanitized_data['created_at'] = date.toLocaleString();
		//}
	}
	//console.log("RETURN SANITIZE\n");
    //return sanitized_data;
}

Data.prototype.checkTimeStamp = function(t, callback) {  
    var self = this;

        	console.log("IN TIMESTAMP\n");
        	db.query('SELECT * FROM data WHERE data_type=$1 AND device_id=$2', 
            [self.params.data_type,self.params.device_id], function (err, result) {
            //console.log(t);
            if(result.rows[0] == null){
            	callback(1);
            }else if(self.params){ //need to check if Arduino device
            }else{
                var x = result.rows.length;
                var most_recent = result.rows[x-1].created_at; //gets last entry
                var time2 = new Date(most_recent);
                if((t.getTime() - time2.getTime()) < 15*60*1000){
                	console.log("cannot insert because of timestamp overlap\n");
                	callback(0);
                }else{
                	callback(1);
                }
            }
        }); 
},

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
				cbErr("Error: " + attr + ' is required');
			}
		}
		
		if(typeof this.params['data'] == 'undefined' || Object.keys(this.params['data']).length <= 0){
			cbErr("Error: No Environmental Indicator data values have been provided.");
		}
		else if((typeof this.params['latitude'] == 'undefined' || typeof this.params['longitude'] == 'undefined')
				&& (typeof device['latitude'] == 'undefined' || typeof device['longitude'] == 'undefined' )){
			cbErr('Error: No locational data has been provided');
			
		}
		else{
			cbSuccess();
		}
	}
},

Data.prototype.addCustomfields=function(){
    curr_schema=schema['data_params'][this.params.data_type];
    for (var attr in this.params){
        if(attr!="device_id" && attr!="data_type"){
            if(typeof curr_schema[attr] == 'undefined'){
                console.log("ATTRIBUTE "+attr+" NOT DEFINED\n");
                curr_schema[attr] = this.params[attr];
                console.log(typeof curr_schema[attr]);
                console.log(schema);
            }
        }
    }

},


module.exports = Data;