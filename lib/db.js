var pg = require("pg");
var databaseLocation = "pg://kevinyoung:@localhost:5432/waterlogs";
var client = new pg.Client(databaseLocation);
client.connect();
module.exports = {
	//cb = call back anonymous function passed to db.query
	//text = select all from users
	//values
   query: function(text, values, cb) {
      pg.connect(databaseLocation, function(err, client, done) {
				if (err) {
					console.error('error fetching client from pool', err);
				} else {
					// actually query the database
        	client.query(text, values, function(err, result) {
          	done(); //releases database fields
		  			if (err) {
							console.error('error running query', err);
						}
          	cb(err, result);
		  			//console.log(result);
        	});
				}
      });
   }
}