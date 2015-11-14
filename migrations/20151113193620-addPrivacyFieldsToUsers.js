var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('invitations', {
		id: { type: 'int', primaryKey: true, autoIncrement: true },
		user_id: { type: 'int' },
		token: 'string',
		recipient_email: 'string',
		created_at: {type: 'datetime'},
		updated_at: {type: 'datetime'},
	}, function(){});
 
	db.runSql('ALTER TABLE "invitations" ADD CONSTRAINT user_id_fk FOREIGN KEY (user_id) REFERENCES users(id)', [], function(){});
  db.runSql('ALTER TABLE "users" ADD COLUMN is_admin boolean DEFAULT false', [], function(){});
  db.runSql('ALTER TABLE "users" ADD COLUMN private_profile boolean DEFAULT false', [], function(){});
  db.runSql('ALTER TABLE "users" ADD COLUMN invites_active boolean DEFAULT false', [], callback);
};

exports.down = function(db, callback) {
  db.runSql('DROP TABLE invitations', [], function(){});
  db.runSql('ALTER TABLE "users" DROP COLUMN is_admin', [], function(){});
  db.runSql('ALTER TABLE "users" DROP COLUMN private_profile', [], function(){});
  db.runSql('ALTER TABLE "users" DROP COLUMN invites_active', [], callback);
};
