var request = require('request');
var crypto = require('crypto');
var keypair = require('keypair');
var User = require('../app/models/user');
var Device = require('../app/models/device');


function runPostTest(){
	var path = 'http://127.0.0.1:3000/data/newData?';
	
	var user_gen_params = {'email' : 'fakeEmail' + User.generateKeyPair().private,
				'password_digest' : 'admin',
				'is_admin' : false};
				
	// create a new user to test data posts with
	var user = new User(user_gen_params);
	user.save(
		function(err, userAfterInsert){
			
			var device_gen_params = {
				'user_id': userAfterInsert.id,
				'name': 'test_data_post',
				'latitude': '0',
				'longitude': '0',
				'mode': 'test?'
			}
			// create a new device associated with the user to test data posts with
			var device = new Device(device_gen_params);
			device.save(
				function(err, deviceAfterInsert){
					
					// a set of possible post parameters
					var data = 'data_type=water&pH=0&latitude=5&longitude=5&device_id=' +  deviceAfterInsert.id;
					var algorithm = 'aes-128-cbc';
					var clearEncoding = 'utf8';
					var cipherEncoding = 'hex';
					
					//encrypt data with shared private key
					
					var cipher = crypto.createCipher(algorithm, userAfterInsert.shared_private_key);
					var encData = cipher.update(data, clearEncoding, cipherEncoding);
					
					// encrypted data
					encData += cipher.final(cipherEncoding);
					
					// sign encrypted data with private key
					var sign = crypto.createSign('RSA-SHA256');
					sign.update(encData);
					var signedData = sign.sign(userAfterInsert.private_key, 'hex');
					data = 'signedData=' + signedData + '&unsignedData=' + encData + '&device_id=' + deviceAfterInsert.id;
					console.log('signed data is');
					console.log(signedData);
					
					//send post request
					var options = {
					  url: path + data,
					  headers: {
						'User-Agent': 'request',
						'accept' : 'application/json',
					  },
					  method: 'post'
					};
					
					
					request(options, function(err, response, body){
						if(err){
							console.log(err);
						}
						else{
							console.log(response);
						}
						
						process.exit();
					});
					
				}
			);
			
		});
		
    
}

runPostTest();
