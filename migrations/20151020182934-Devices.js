var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
	db.createTable('devices', {
		id: { type: 'int', primaryKey: true },
		user_id: {type: 'int'}
	}, callback);
};


exports.down = function(db, callback) {
  db.dropTable('devices', callback);
};
