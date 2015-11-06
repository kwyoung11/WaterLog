var schemas = require("../../schemas/schemas.js");
var Application = require('./application');
var db = require('../../lib/db');

var Mobile = function (data) {
    Application.call(this,data);
    console.log("data is " + JSON.stringify(data));
    this.data = this.sanitize(data);
    console.log("sanitized data is " + JSON.stringify(this.data));
    //this.paramOrder = ['user_id', 'name', 'latitude', 'longitude'];
}

Mobile.prototype = Object.create(Application.prototype);
Mobile.prototype.constructor = Mobile;
/* prototype properties */
Mobile.prototype.data = {};
//Mobile.prototype.paramOrder = [];

Mobile.prototype.save = function(callback) {  
    var self = this;
    this.data = this.sanitize(this.data);
        
        /*db.query('INSERT INTO data (user_id, name, latitude, longitude) VALUES($1, $2, $3, $4) returning *', self.getDataInArrayFormat(), function (err, result) {
            if (err) {
                console.log(err);
                return callback(err);
            }
                return callback(null, result.rows[0]);
        }); */            
            
}