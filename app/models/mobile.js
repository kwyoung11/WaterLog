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

Mobile.prototype.checkTimeStamp = function(callback) {  
    var self = this;
    //this.data = this.sanitize(this.data);
        
        db.query('SELECT * FROM data WHERE data_type=$1 AND device_id=$2', 
            [self.data.data_type,self.data.device_id], function (err, result) {
            if (err) {
                console.log(err);
                return callback(err);
            }
                console.log("MOST RECENT TIMESTAMP\n");
                var x = result.rows.length;
                var most_recent = result.rows[x-1].created_at;
                var time = new Date(most_recent);
                console.log(time.getMinutes());
                return callback(null, result.rows[0]);
        });            
            
},

Mobile.prototype.sanitize = function(params) {  
    console.log("SANITIZING DATA NOW");

    var x;
    var temp = {};
    //temp['data']={};
    for (var attr in params){
        if (attr == 'custom_key' && params[attr]!=""){
            temp[params[attr]]="";
        }else if (attr == 'custom_value'){
            x=params[attr];
        }else if(params[attr]!=""){
            //data not inputted for this field
            temp[attr] = params[attr];
                    
        }
    }
            //console.log(temp);
    for (var attr in temp){
        if(temp[attr]==""){
            temp[attr]=x;
        }
    }
    return temp;
}

module.exports = Mobile;