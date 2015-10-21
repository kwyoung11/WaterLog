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
	
	setCookie: function(response) {
	
	}

}

module.exports = new util();