var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
	db.createTable('data', {
		id: { type: 'int', primaryKey: true, autoIncrement: true },
		device_id: { type: 'int' },
		data_type: { type: 'string'}
	}, function(){});
	

	var addDeviceIdFK = 'ALTER TABLE "data" ADD CONSTRAINT device_id_fk FOREIGN KEY (device_id) REFERENCES devices(id)';
	var addKeysColumn = 'ALTER TABLE "data" ADD COLUMN keys varchar[]';
	var addValuesColumn = 'ALTER TABLE "data" ADD COLUMN values varchar[]';
	var addTimeColumn = 'ALTER TABLE "data" ADD COLUMN created_at timestamp';
	var addCollectedColumn = 'ALTER TABLE "data" ADD COLUMN collected_at timestamp';
	db.runSql(addKeysColumn, [], function(){});
	db.runSql(addValuesColumn, [], function(){});  
	db.runSql(addTimeColumn, [], function(){});
	db.runSql(addCollectedColumn, [], function(){}); 
	db.runSql(addDeviceIdFK, [], callback);
};

exports.down = function(db, callback) {
  db.dropTable('data', callback);
};