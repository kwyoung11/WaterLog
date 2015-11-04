var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
	db.createTable('devices', {
		id: {type: 'int', primaryKey: true, autoIncrement: true },
		user_id: { type: 'int'},
		latitude: 'string',
		longitude: 'string',
		name: 'string'
		
	}, callback);

	var addDeviceIdFK = 'ALTER TABLE "devices" ADD CONSTRAINT user_id_fk FOREIGN KEY (user_id) REFERENCES users(id)';
	db.runSql(addDeviceIdFK, [], callback);
};


exports.down = function(db, callback) {
  db.dropTable('devices', callback);
};
