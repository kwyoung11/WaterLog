var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var User = require('../app/models/user');

exports.up = function(db, callback) {
	db.runSql('', [], function(){
		var params = {'email' : 'changeThis@changeThis.com',
					'password_digest' : 'admin',
					'is_admin' : true};
		var user = new User(params);
		user.save(callback);
	});
	
	
};

exports.down = function(db, callback) {
	db.runSql('', [], callback);
};
