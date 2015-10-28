var pg = require("pg");
<<<<<<< HEAD
var databaseLocation = "pg://Christine Schroeder:@localhost:5432/waterlogs";
=======
var util = require('./util.js');

var databaseLocation = util.getDatabaseLocation();
>>>>>>> 2b3ed52cae2c92bb4140fda938f05466d1ed962a
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