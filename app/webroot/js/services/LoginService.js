enviroHubApp.factory('SessionService', function ($http, PubSubService){
  var loggedIn = {};

  var user = undefined;

  loggedIn.loginSuccess = 'LoginSuccess';  // Login Status
  loggedIn.logoutSuccess = 'LogoutSuccess'; // Login Status
  loggedIn.loginFail = 'LoginFail';        // Login Status

  loggedIn.status = loggedIn.loginFail;

  loggedIn.logoutUser = function (username) {
    username = username | user;
    user = undefined;
    loggedIn.status = loggedIn.loginFail;
    PubSubService.publish(loggedIn.logoutSuccess);
  }

  loggedIn.loginUser = function (username, password) {
    var q = $http({
      method: 'POST',
      url: '/login',
      dataType: 'json',
      data: {
        email: username,
        password_digest: password
      }
    });
    if (username == "asdf@asdf.com"){
      user = username;
      loggedIn.status = loggedIn.loginSuccess;
      PubSubService.publish(loggedIn.loginSuccess);
    } else {
      loggedIn.status = loggedIn.loginFail;
      PubSubService.publish(loggedIn.loginFail);
    }
    q.success(function(data){
      console.log("Login Request", data);

    });
  }

  loggedIn.registerUser = function (email, pass){
    var x = $http({
      method: 'POST',
      url: '/users',
      data: {
        email: email,
        password_digest: pass
      }
    });
    x.success(function(response){
      console.log("Register Request Succesful", response);
    })
    console.log(x);
  }
  return loggedIn;
});
