var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var User = require('../app/models/user');

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

exports.up = function(db, callback) {
	var params = {'email' : 'admin@admin.com',
					'password_digest' : 'admin',
					'is_admin' : true};
		var user = new User(params, {'sync': true});
		var arr = [user.data.email, user.data.password_digest, user.data.auth_token, user.data.salt, user.data.public_key, user.data.private_key, user.data.shared_private_key, user.data.email_confirmation_token];
		var string = arr.join("','");
		string = "'" + string + "'";
		// console.log(string);
		db.runSql('INSERT INTO users (email, password_digest, auth_token, salt, public_key, private_key, shared_private_key, email_confirmation_token) VALUES (' + string +')', [], callback);
		// user.save(function(err, user) {throw true;});
};

exports.down = function(db, callback) {
	User.find('id', 1, function(err, user) {
		user.destroy(user.data.id, function(result) {
			throw true;
		});
	});
};
