var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
	db.dropTable('users', 'ifExists', callback);
	db.createTable('users', {
  	id: { type: 'int', primaryKey: true, autoIncrement: true },
  	email: {type: 'string', unique: true },
  	password_digest: 'string',
  	auth_token: 'string',
  	salt: 'string'
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('users', 'ifExists', callback);
	db.createTable('users', {
  	id: { type: 'int', primaryKey: true, autoIncrement: true },
  	email: 'string',
  	password_digest: 'string',
  	auth_token: 'string',
  	salt: 'string'
  }, callback);
};
