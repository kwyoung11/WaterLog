var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('users', {
  	id: { type: 'int', primaryKey: true, autoIncrement: true },
  	email: {type: 'string', unique: true },
  	password_digest: 'string',
  	auth_token: 'string',
  	salt: 'string',
  	password_reset_token: 'string',
  	password_reset_sent_at: 'string',
	public_key: 'string',
	private_key: 'string',
	shared_private_key: 'string'
  }, callback);
  
};

exports.down = function(db, callback) {
  db.dropTable('users', callback);
};
