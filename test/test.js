var request = require('request');
var crypto = require('crypto');
var keypair = require('keypair');
var db = require('../lib/db');



function runPostTest(){
	var path = 'http://127.0.0.1:3000/data/newData?';
	var params = 'device_id=3&data_type=water&pH=0&latitude=5&longitude=5'
	
    var algorithm = 'aes-128-cbc';
    var key = db.query('SELECT ');
    var clearEncoding = 'utf8';
    var cipherEncoding = 'hex';
    //If the next line is uncommented, the final cleartext is wrong.
    //cipherEncoding = 'base64';
    var cipher = crypto.createCipher(algorithm, key);
    var encData = cipher.update(data, clearEncoding, cipherEncoding);
	encData += cipher.final(cipherEncoding);
	console.log(encData);
    var decipher = crypto.createDecipher(algorithm, key);
    var unencrypted = decipher.update(encData, cipherEncoding, clearEncoding);
	console.log('parameters should be ?device_id=2&encryptedData=' + encData);
	console.log(encData);
	
	var options = {
	  url: path + params,
	  headers: {
		'User-Agent': 'request',
		'accept' : 'application/json',
	  },
	  method: 'post'
	};

	request(options, function(){});
}

var options = {bits: 128};
var pair = keypair(options);
console.log(pair);
var pair2 = keypair(options);
console.log(pair2);
