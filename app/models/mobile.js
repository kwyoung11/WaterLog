var schemas = require("../../schemas/schemas.js");
var Application = require('./application');
var db = require('../../lib/db');

var Mobile = function (data) {
    Application.call(this,data);
    //console.log("data is " + JSON.stringify(data));
    this.data = this.sanitize(data);
    console.log("sanitized data is " + JSON.stringify(this.data));
    //this.paramOrder = ['user_id', 'name', 'latitude', 'longitude'];
}

Mobile.prototype = Object.create(Application.prototype);
Mobile.prototype.constructor = Mobile;
/* prototype properties */
Mobile.prototype.data = {};
//Mobile.prototype.paramOrder = [];

Mobile.prototype.sanitize = function(params) {  
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