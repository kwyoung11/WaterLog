/* 
* This controller will handle the devices pages, including registration,
* My Devices page, etc.
*/
var view = require('../../lib/view');
var db = require('../../lib/db');
var util = require('../../lib/util');

var devices_controller = function() {};
devices_controller.prototype = {

	//GET /devices/new
	add: function(params, callback) {
		var callback = (typeof callback === 'function') ? callback : function() {};
		var id = params['id'];
		
		var data = null;
		view.renderView('/devices/new', data, function(data) {
		  callback(data);
		});
	},

	//GET /devices/edit

	view: function(params, callback) {
			var callback = (typeof callback === 'function') ? callback : function() {};
			var id = params['user_id'];
			device.findById(id, function(error,device){
				//var d= device.get()
				var data = { 'devices': {
								'Id' : device.get(id)
							} };
				/*var data = {
			  		'devices' : [{
			    	'nickname'    : 'Device1',
			    	'viewLink': 'devices/Device1/',
			    	'ID Number' : '1234'
			  		},{
			    	'nickname'    : 'Device2',
			    	'viewLink': 'devices/Device2/',
			    	'ID Number' : '1234'
			  		}]
				};*/

    			view.renderView('devices/view',data,function(data){
    				callback(data);
    			});

    		});
	},
	update: function(params, callback) {
		var callback = (typeof callback === 'function') ? callback : function() {};
		
		var data = null;
		view.renderView('/devices/new', data, function(data) {
		  callback(data);
		});
	},
	destroy: function(params, callback) {
		var callback = (typeof callback === 'function') ? callback : function() {};
		
		var data = null;
		view.renderView('/devices/new', data, function(data) {
		  callback(data);
		});
	},
	//POST new user
	create: function(params, callback) {
    	var device = new Device(params); // create new user object
    	device.save(function(error,device){
    		data = {'id': device}
    		view.renderView('devices/view',data,function(data){
    			callback(data);
    		});

    	});
    	console.log("Params are: " +JSON.stringify(params));
    	var data = null;
    	view.renderView('devices/view',data,function(data){
    		callback(data);
    	});

	}


}

module.exports = new devices_controller();