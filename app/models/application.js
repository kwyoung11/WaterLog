var Application = function() {

}

Application.prototype.get = function(name) {  
    return this.data[name];
}

Application.prototype.set = function(name, value) {  
    this.data[name] = value;
}

module.exports = Application;