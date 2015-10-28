var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
	db.createTable('data', {
		id: { type: 'int', primaryKey: true },
		device_id: { type: 'int' },
		data_type: 'string'
	}, callback);
	var addKeysColumn = 'ALTER TABLE "data" ADD COLUMN keys varchar[]';
	var addValuesColumn = 'ALTER TABLE "data" ADD COLUMN values varchar[]';
	var addTimeColumn = 'ALTER TABLE "data" ADD COLUMN date_time timestamp';
	db.runSql(addKeysColumn, [], callback);
	db.runSql(addValuesColumn, [], callback);  
	db.runSql(addTimeColumn, [], callback); 
};

exports.down = function(db, callback) {
  db.dropTable('data', callback);
};