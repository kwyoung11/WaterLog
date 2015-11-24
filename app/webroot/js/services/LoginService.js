enviroHubApp.factory('LoginService', function ($http){
  var loggedIn = {};

  loggedIn.success = 'Login Success'; // Login Status
  loggedIn.fail = 'Login Fail';       // Login Status

  loggedIn.status = loggedIn.fail;

  loggedIn.loginUser = function (username, password) {
    if (username == "asdf")
      loggedIn.status = loggedIn.success;
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
    console.log(x);
  }
  return loggedIn;
});
