var request = require('request');
var crypto = require('crypto');
var keypair = require('keypair');
var User = require('../app/models/user');
var Device = require('../app/models/device');

// encrypted test is not working right now due to insufficient key size.  The generation of long RSA keys was making the login sequence take too long.
function runPostTest(encryptedOption, cb){
	var path = 'http://127.0.0.1:3000/data/newData?';
	
	var user_gen_params = {'email' : 'fakeEmail#' + Math.random() * 10000,
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
					
					
					if(encryptedOption == true){
						
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
						
						
					}
					
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
						cb();
					});
				}
			);
			
		});
		
    
}
// test for encrypted posts.  We should see something like "Post successful" in the response body
runPostTest(true, function(){});
// test for unencrypted posts.  We should see something like "Unencrypted post successful" in the response body
runPostTest(false, function(){process.exit();});
