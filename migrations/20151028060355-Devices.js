var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
	db.createTable('devices', {
		device_id: {type: 'int', primaryKey: true, autoIncrement: true },
		//add_foriegn_key: id, : users,
		id: { type: 'int'},
		nickname: 'string'
		
	}, function(){});

	var addDeviceIdFK = 'ALTER TABLE "devices" ADD CONSTRAINT id_fk FOREIGN KEY (id) REFERENCES users(id)';
	db.runSql(addDeviceIdFK, [], callback);
};


exports.down = function(db, callback) {
  db.dropTable('devices', callback);
};
