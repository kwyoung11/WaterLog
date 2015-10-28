/* 
This controller will handle our API.
*/

var view = require('../../lib/view');
var data_controller = function() {};
data_controller.prototype = {

	// POST /data/new
	new: function(params, callback) {
		
		var sqlPost = 'INSERT INTO ';
		var columns = 'Data (';
		var values = ' VALUES (';
		var size = Object.keys(params).length;
		var counter = 1;
		for(key in params){
			columns += key;
			values += params[key]
			if(counter < size){
				columns += ', ';
				values += ', ';
			}
			counter++;
		}
		columns += ')';
		values += ')';
		sqlPost += columns + values + ';';
		console.log('sql post is ' + sqlPost);
	},



};

module.exports = new data_controller();