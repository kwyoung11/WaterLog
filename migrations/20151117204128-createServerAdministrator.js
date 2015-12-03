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
		var user = new User(params);
		user.save(function(err, user) {throw true;});
};

exports.down = function(db, callback) {
	User.find('id', 1, function(err, user) {
		user.destroy(user.data.id, function(result) {
			throw true;
		});
	});
};
