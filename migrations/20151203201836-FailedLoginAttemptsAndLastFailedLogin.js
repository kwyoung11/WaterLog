var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
	db.runSql('ALTER TABLE "users" ADD COLUMN failed_login_attempts int DEFAULT 0', [], function(){});
	db.runSql('ALTER TABLE "users" ADD COLUMN last_failed_login varchar(255)', [], function(){throw true;});
};

exports.down = function(db, callback) {
  db.runSql('ALTER TABLE "users" DROP COLUMN failed_login_attempts', [], function(){});
	db.runSql('ALTER TABLE "users" DROP COLUMN last_failed_login', [], function(){throw true;});
};
