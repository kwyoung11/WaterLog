var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
	db.createTable('devices', {
		id: {type: 'int', primaryKey: true, autoIncrement: true },
		user_id: { type: 'int'},
		latitude: 'string',
		longitude: 'string',
		name: 'string',
		mode: 'string',
		type_of_data: 'string'
		
	}, function(){});

	var addDeviceIdFK = 'ALTER TABLE "devices" ADD CONSTRAINT user_id_fk FOREIGN KEY (user_id) REFERENCES users(id)';
	var addKeysColumn = 'ALTER TABLE "devices" ADD COLUMN keys varchar[]';
	var addUnitsColumn = 'ALTER TABLE "devices" ADD COLUMN units varchar[]';
	db.runSql(addKeysColumn, [], function(){});
	db.runSql(addUnitsColumn, [], function(){}); 
	db.runSql(addDeviceIdFK, [], callback);
};


exports.down = function(db, callback) {
  db.dropTable('devices', callback);
};
