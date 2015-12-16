var qs = require('querystring');
var fs = require("fs");
var crypto = require('crypto');
var path = require('path');

var util = function () {
	this.req = null;
	this.cookie = null;
};

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length == 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

// Initialize request as property on the classes prototype object
// util.prototype.req = null;
// util.prototype.cookie = null;

util.prototype = {
	// return the current user
	current_user: function(cookie) {
		db.query("SELECT * from users WHERE auth_token=$1", [cookie['auth_token']], function(err, result) {
			return result;
		});
	},

	size: function (obj) {
		var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
	},

	parseCookies: function(req) {
		var list = {},
			rc = req.headers.cookie;

		rc && rc.split(';').forEach(function( cookie ) {
			var parts = cookie.split('=');
			list[parts.shift().trim()] = decodeURI(parts.join('='));
		});

    return list;
	},

	setRequest: function(req) {
		this.req = req;
	},
	
	getRequest: function() {
		return this.req;
	},
	
	extractPostData: function(req, cb) {
          var self = this;
		if (req.method == 'POST') {
     	var body = '';

     	req.on('data', function (data) {
     	    body += data;
     	    // console.log("Data is :" + data);
     	    // Too much POST data, kill the connection!
     	    // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
     	    if (body.length > 1e6)
     	        req.connection.destroy();
     	});

     	req.on('end', function () {
            var post;
            if (body.indexOf('{') >= 0) {
              post = JSON.parse(body);
            } else {
     	      post = qs.parse(body);
            }      
     	    cb(post);
     	    // use post['blah'], etc.
     	});
    }
	},

	merge: function(obj1, obj2) {
		for (var attrname in obj2) { obj1[attrname] = obj2[attrname]; }
	},
        
	getDatabaseLocation: function() {
		if (process.env.DATABASE_URL) {
			return process.env.DATABASE_URL;
		} else {
			var contents = fs.readFileSync("./database.json");
		
			// Define to JSON type
			var jsonContent = JSON.parse(contents);
			var environment = '';
			if (process.env.NODE_ENV == 'development') {
				environment = jsonContent.dev;
			} else {
				environment = jsonContent.prod;
			}
			var databaseLocation = '';
			databaseLocation += environment.driver;
			databaseLocation += '://';
			databaseLocation += environment.user;
			databaseLocation += ':';
			databaseLocation += environment.password;
			databaseLocation += '@localhost:';
			databaseLocation += environment.port;
			databaseLocation += '/';
			databaseLocation += environment.database;
			return databaseLocation;	
		}
		
	},
	
	getDeviceAndUser: function(device_id, callBackOnFailure, callbackOnSuccess){
		var db = require('./db');
		console.log(device_id);
		db.query('SELECT * FROM devices WHERE id=$1', [device_id], function(err, result){
			if(typeof err != 'undefined' && err != null){
				return callBackOnFailure(err);
			}
			else if (result.rowCount == 0) {
				var myErr = "No device found with device_id = to " + device_id;
				console.log(myErr);
				return callBackOnFailure(myErr);  
			} 
			else{
				var device = result.rows[0];
				db.query('SELECT * FROM users WHERE id=$1', [device.user_id], function(err, result){
					if(err){
						return callBackOnFailure(err);
					}
					else if (result.rowCount == 0) {
						var myErr = "No user connected to device with id = to " + device.id;
						console.log(myErr);
						return callBackOnFailure(myErr);  
					}
					else{
						var user = result.rows[0];
						return callbackOnSuccess([device, user]);
					}
				});
			}
		});
		
	},
	
	encrypt: function(secret_key, dataToEncrypt){
		var algorithm = 'aes-128-cbc';
		var clearEncoding = 'utf8';
		var cipherEncoding = 'hex';
		var encryptedData = '';
		if(typeof dataToEncrypt == 'string'){
			var cipher = crypto.createCipher(algorithm, secret_key);
			encryptedData = cipher.update(dataToEncrypt, clearEncoding, cipherEncoding);
			encryptedData += cipher.final(cipherEncoding);
		}
		return encryptedData;
	}



};

module.exports = new util();
