var view = require('../../lib/view');
var home_controller = function() {};
home_controller.prototype = {
	
	// GET / (root)
	index: function(params, callback) {
			var callback = (typeof callback === 'function') ? callback : function() {};
			
			var data = {
			  'users' : {
			    'name'    : 'James',
			    'viewLink': '/view/james/'
			  }
			};
			
			view.renderView('home/index', data, function(data) {
			  callback(data);
			});
	}

};

module.exports = new home_controller();