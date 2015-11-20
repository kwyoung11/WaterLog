/*
 * /lib/controller.js
 */
var view = require('./view');
var controller = function() {};
controller.prototype = {
		// delegate: function(action, arg, callback) {
		// 	var len = action.length;
		// 	if (action.charAt(len-1) != "s") { // its in singular form
  //    		action += "s";
		// 	} 

		// 	controllers[action][arg]
		// },

    view : function(user, callback) {
    	var callback = (typeof callback === 'function') ? callback : function() {};
    	var data = {
    	  'user' : user ? user : 'nobody'
    	};
	
    	view.renderView('view', data, function(data) {
    	  callback(data);
    	});
 		},

 		home : function(arg, callback) {

			var callback = (typeof callback === 'function') ? callback : function() {};
			
			var data = {
			  'users' : {
			    'name'    : 'James',
			    'viewLink': '/view/james/'
			  }
			};
			
			view.renderView('home', data, function(data) {
			  callback(data);
			});
  	},



  };
module.exports = new controller();