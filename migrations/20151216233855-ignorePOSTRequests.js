var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.runSql("ALTER TABLE devices ADD COLUMN ignore_post_requests boolean DEFAULT false",[], callback);
};

exports.down = function(db, callback) {
  db.runSql('ALTER TABLE "devices" DROP COLUMN ignore_post_requests', [], callback);
};
