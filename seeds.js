var db = require('/lib/db');
var User = require('app/models/user');
var Device = require('app/models/device'); 
var Data = require('/app/models/data');
var moment = require('moment');

var a = moment('2015-06-01'); // July 1 2015
var b = moment('2015-11-13'); // November 13 2015

for (var m = a; m.isBefore(b); m.add('days', 1)) {
	var ph = Math.random() * (9.0 - 5.0) + 5.0;
	var tds = Math.random() * (400);
	var temp = Math.random() * (80 - 10) + 10;
	var datetime = m.format();
  console.log(datetime);
  db.query("INSERT INTO data (device_id, data_type, keys, values, created_at) VALUES (1, 'Water', '{pH, turbidity, temperature}', '{$1, $2, $3}', NOW())", [pH, tds, temp], function(err, result) {

  });

  var ph = Math.random() * (9.0 - 5.0) + 5.0;
	var tds = Math.random() * (400);
	var temp = Math.random() * (80 - 10) + 10;
	db.query("INSERT INTO data (device_id, data_type, keys, values, created_at) VALUES (2, 'Water', '{pH, turbidity, temperature}', '{$1, $2, $3}', NOW())", [pH, tds, temp], function(err, result) {

  });	
}
	

	
