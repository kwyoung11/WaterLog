var qs = require('querystring');

var util = function () {
	this.req = null;
	this.cookie = null;
};

// Initialize request as property on the classes prototype object
// util.prototype.req = null;
// util.prototype.cookie = null;

util.prototype = {
	// return the current user
	current_user: function(cookie) {
		db.query("SELECT * from users WHERE auth_token=$1", [cookie['auth_token']], function(err, result) {
			return result;
		});
	},

	parseCookies: function(req) {
    var list = {},
        rc = req.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
	},

	setRequest: function(req) {
		this.req = req;
	},
	
	getRequest: function() {
		return this.req;
	},
	
	extractPostData: function(req, cb) {
		if (req.method == 'POST') {
     	var body = '';

     	req.on('data', function (data) {
     	    body += data;
     	    console.log("Data is :" + data);
     	    // Too much POST data, kill the connection!
     	    // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
     	    if (body.length > 1e6)
     	        req.connection.destroy();
     	});

     	req.on('end', function () {
     	    var post = qs.parse(body);
     	    console.log("Inside post is: " + JSON.stringify(post));
     	    cb(post);
     	    // use post['blah'], etc.
     	});
    }
    cb({});
	},

	merge: function(obj1, obj2) {
		for (var attrname in obj2) { obj1[attrname] = obj2[attrname]; }
	}



};

module.exports = new util();