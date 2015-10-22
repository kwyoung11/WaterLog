var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
	db.changeColumn('users', 'id', { 
		id: { type: 'int', primaryKey: true, autoIncrement: true }
	}, callback);
};

exports.down = function(db, callback) {
	db.changeColumn('users', 'id', { 
		id: { type: 'int', primaryKey: true, autoIncrement: false }
	}, callback);
};
