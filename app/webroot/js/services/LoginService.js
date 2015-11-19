enviroHubApp.factory('LoginService', function ($http){
    var loggedIn = {};
    loggedIn.success = 'Login Success';
	logginIn.fail = 'Login Fail';

	function Login(username, password) {
	   	if (username.equals(GetUserID(username))) {
	      	if(password.equals(GetUserPassword(username,password))) {
	      		return true;
	    	} else {
	   			return false;
			}
		} else {
			return false;
		}
	}
		
	function GetUserID(username) {
	   return "rae"
	   //return $http.get(blah blah blah) 
	}

	function GetUserPassword(username, password) {
	   return "123"
	   //return $http.get(blah blah blah)
	}


        $http.get("http://catfacts.api.appspot.com/api/facts")
        .success(function(response){loggedIn.value = response;});
        loggedIn.devices={"devices":[
        {"deviceName": "d1", "temp": 77, "lat": 38.9929846 , "lng": -76.9468502},
        {"deviceName": "d2", "temp": 82, "lat": 38.9943243 , "lng": -76.9434234},
        {"deviceName": "d3", "temp": 63, "lat": 38.9912345 , "lng": -76.9422222},
        {"deviceName": "d4", "temp": 70, "lat": 38.9933333 , "lng": -76.9476543},
        {"deviceName": "d5", "temp": 71, "lat": 38.9954545 , "lng": -76.9245466},
        ]};
        return loggedIn;
});


