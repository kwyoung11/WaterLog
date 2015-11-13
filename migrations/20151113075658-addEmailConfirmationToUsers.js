var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.runSql('ALTER TABLE "users" ADD COLUMN email_confirmation_token varchar', [], function(){});
  db.runSql('ALTER TABLE "users" ADD COLUMN email_confirmed boolean DEFAULT false', [], callback);
};

exports.down = function(db, callback) {
  db.runSql('ALTER TABLE "users" DROP COLUMN email_confirmation_token', [], function(){});
  db.runSql('ALTER TABLE "users" DROP COLUMN email_confirmed', [], callback);
};
