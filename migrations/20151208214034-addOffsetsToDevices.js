var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.runSql("ALTER TABLE devices ADD COLUMN offsets real[] DEFAULT '{0.0, 0.0, 0.0, 0.0, 0.0}'",[], callback);
};

exports.down = function(db, callback) {
  db.runSql('ALTER TABLE "devices" DROP COLUMN offsets', [], callback);
};
