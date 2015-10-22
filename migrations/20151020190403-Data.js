var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
	db.createTable('data', {
		id: { type: 'int', primaryKey: true },
		device_id: { type: 'int' },
		data_type: 'string'
	}, callback);
	
	var addParametersColumn = 'ALTER TABLE "data" ADD COLUMN parameters text[]';
	var addValuesColumn = 'ALTER TABLE "data" ADD COLUMN values text[]';
	
	db.runSql(addParametersColumn, [], callback);
	db.runSql(addValuesColumn, [], callback); 
};

exports.down = function(db, callback) {
  db.dropTable('data', callback);
};