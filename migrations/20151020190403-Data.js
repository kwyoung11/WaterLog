var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
	db.createTable('data', {
		id: { type: 'int', primaryKey: true, autoIncrement: true },
		device_id: { type: 'int' },
		data_type: { type: 'string' }
	}, function(){});
	var addKeysColumn = 'ALTER TABLE "data" ADD COLUMN keys varchar[]';
	var addValuesColumn = 'ALTER TABLE "data" ADD COLUMN values varchar[]';
	var addTimeColumn = 'ALTER TABLE "data" ADD COLUMN created_at timestamp';
	db.runSql(addKeysColumn, [], callback);
	db.runSql(addValuesColumn, [], callback);  
	db.runSql(addTimeColumn, [], callback); 
};

exports.down = function(db, callback) {
  db.dropTable('data', callback);
};