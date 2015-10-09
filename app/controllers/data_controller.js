var view = require('../../lib/view');
var data_controller = function() {};
data_controller.prototype = {
	
	// GET /users/new
	index: function(params, callback) {
			var callback = (typeof callback === 'function') ? callback : function() {};
			
			var data = {
			  'users' : {
			    'name'    : 'James',
			    'viewLink': '/view/james/'
			  }
			};
			
			view.renderView('data/index', data, function(data) {
			  callback(data);
			});
	}

};

module.exports = new data_controller();