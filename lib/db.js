//integration task on asana
var pg = require("pg");
var databaseLocation = "pg://cmsc435:U223dda3Xqpp&^Aen@virulent.cs.umd.edu:1337/waterlogs";
var testLocation = "pg://postgres:1234hopf@localhost:5432/postgres";
var client = new pg.Client(databaseLocation);
client.connect();
module.exports = {
	//cb = call back anonymous function passed to db.query
	//text = select all from users
	//values
   query: function(text, values, cb) {
      pg.connect(testLocation, function(err, client, done) {
		if(err){
			console.error('error fetching client from pool', err);
		}else{
		//actually query the database
        client.query(text, values, function(err, result) {
          done(); //releases database fields
		  if(err){
				console.error('error running query', err);
				}
          cb(err, result);
		  //console.log(result);
        })
		}
      });
   }
}